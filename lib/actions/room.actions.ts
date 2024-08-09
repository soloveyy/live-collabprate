'use server'

import {nanoid} from "nanoid";
import {liveblocks} from "@/lib/liveblocks";
import {revalidatePath} from "next/cache";
import {getAccessType, parseStringify} from "@/lib/utils";
import {error} from "lib0";
import {redirect} from "next/navigation";

export const createDocument = async ({ userId, email}: CreateDocumentParams) => {
    const roomId = nanoid();
    try {
        const metadata = {
            creatorId: userId,
            email,
            title: 'Untitled'
        }

        const usersAccesses: RoomAccesses = {
            [email]: ['room:write']
        }
        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses: usersAccesses,
            defaultAccesses: []
        });

        revalidatePath('/')

        return parseStringify(room)

    } catch (error) {
        console.log(`Error creating room: ${error}`);
    }
}

export const getDocument = async ({ roomId, userId }: { roomId: string; userId: string}) => {
    try {
        const room = await liveblocks.getRoom(roomId);
        const hasAccess = Object.keys(room.usersAccesses).includes(userId)
        // if(!hasAccess) {
        //     throw new Error("You don't have access to room");
        // }

        return parseStringify(room)
    } catch (error) {
        console.log(`Error getting room: ${error}`);
    }
}

export const updateDocument = async ( roomId: string, title: string ) => {
    try {
        const updateRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title
            }
        });

        revalidatePath(`/documents/${roomId}`)

        return parseStringify(updateRoom)
    } catch (error) {
        console.log(`Error updating room: ${error}`);
    }
}

export const getAllDocuments= async (email: string) => {
    try {
        const rooms = await liveblocks.getRooms({ userId: email });

        return parseStringify(rooms)
    } catch (error) {
        console.log(`Error getting all rooms: ${error}`);
    }
}

export const deleteDocument = async ({roomId}: {roomId: string}) => {
    await liveblocks.deleteRoom(roomId);
    revalidatePath('/');
    redirect('/');
}

export const updateDocumentAcceess = async ({roomId, email, userType, updatedBy }: ShareDocumentParams ) => {
    try {
        const usersAccesses: RoomAccesses = {
            [email]: getAccessType(userType) as AccessType
        }
        const room = await liveblocks.updateRoom(roomId, {
            usersAccesses: usersAccesses,
        });

        if(room) {
            const notificationId = nanoid();

            await liveblocks.triggerInboxNotification({
                userId: email,
                kind: '$documentAccess',
                subjectId: notificationId,
                activityData: {
                    userType,
                    title: `${updatedBy.name} has given you ${userType} access to the document.`,
                    updatedBy: updatedBy.name,
                    avatar: updatedBy.avatar,
                    email: updatedBy.email
                },
                roomId
            })
        }

        revalidatePath(`/documents/${roomId}`)
        return parseStringify(room)
    } catch {
        console.log(`Error updating room: ${error}`);
    }
}

export const removeCollaborator = async ({roomId, email}: {roomId: string, email: string}) => {
    try {
        const room = await liveblocks.getRoom(roomId);
        if(room.metadata.email === email){
            throw new Error(`Trying remove yourself!`)
        }

        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [email]: null
            }
        });

        revalidatePath(`/documents/${roomId}`)
        return parseStringify(updatedRoom)
    } catch (error) {
        console.log(`Error remove collaborator: ${error}`);
    }
}