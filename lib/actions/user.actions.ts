'use server';

import {clerkClient} from "@clerk/nextjs/server";
import {parseStringify} from "@/lib/utils";
import {error} from "lib0";
import {liveblocks} from "@/lib/liveblocks";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
    try {
        const { data } = await clerkClient.users.getUserList({
            emailAddress: userIds,
        })

        const users = data.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl
        }))

        const sortedUsers = userIds.map((email) => users.find((user) => email === user.email));
        return parseStringify(sortedUsers);
    } catch (error) {
        console.log(`Error in getClerkUsers: ${error}`);
    }
}

export const getDocumentUsers = async ({roomId, currentUser, text}: {roomId: string, currentUser: string, text: string}) => {
    try {
        const room = await liveblocks.getRoom(roomId);
        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser)

        if(text.length){
            const lowerCaseText = text.toLowerCase();
            const filteredUsers = users.filter((email) => email.toLowerCase().includes(lowerCaseText));
            return parseStringify(filteredUsers);
        }
        return parseStringify(users)
    } catch (error) {
        console.log(`Error getting document users: ${error}`);
    }
}