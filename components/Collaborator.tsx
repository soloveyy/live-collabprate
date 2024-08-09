import React, {useState} from 'react';
import Image from "next/image";
import UserTypeSelector from "@/components/UserTypeSelector";
import {Button} from "@/components/ui/button";
import {removeCollaborator, updateDocumentAcceess} from "@/lib/actions/room.actions";

const Collaborator = ({roomId, creatorId, collaborator, email, user}: CollaboratorProps) => {
    const [userType, setUserType] = useState(collaborator.userType || 'viewer');
    const [loading, setLoading] = useState(false);

    const shareDocHandler = async (type: string) => {
        setLoading(true);
        await updateDocumentAcceess({ roomId, email, userType: type as UserType, updatedBy: user });
        setLoading(false);
    }
    const removeCollaboratorHandler = async (email: string) => {
        setLoading(true);
        await removeCollaborator({ roomId, email });
        setLoading(false);
    }

    console.log('creator id ', creatorId)
    console.log('collaborator.id ', collaborator.id)

    return (
        <li className="flex items-center justify-between gap-2 py-3">
            <div className="flex gap-2">
                <Image
                    src={collaborator.avatar}
                    alt={collaborator.name}
                    width={36}
                    height={36}
                    className="size-9 rounded-full"
                />
                <div>
                    <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">
                        {collaborator.name}
                        <span className="text-10-regular pl-2 text-blue-100">
                            {loading && "Loading..."}
                        </span>
                    </p>
                    <p className="text-sm front-light text-blue-100">
                        {collaborator.email}
                    </p>
                </div>
            </div>
            {creatorId === collaborator.id ? (
                <p className="text-sm text-blue-100">Owner</p>
            ) : (
                <div className="flex items-center">
                    <UserTypeSelector userType={userType as UserType} setUserType={setUserType || 'viewer'} onClickHandler={shareDocHandler} />
                    <Button type="button" onClick={()=> removeCollaboratorHandler(collaborator.email)}>
                        Remove
                    </Button>
                </div>
            )}
        </li>
    );
};

export default Collaborator;