'use client'

import React, {useState} from 'react';
import { useSelf } from "@liveblocks/react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import Image from "next/image";
import {Input} from "@/components/ui/input";
import UserTypeSelector from "@/components/UserTypeSelector";
import Collaborator from "@/components/Collaborator";
import {updateDocumentAcceess} from "@/lib/actions/room.actions";

const ShareModal = ({ roomId, collaborators, creatorId, currentUserType }: ShareDocumentDialogProps) => {
    const user = useSelf()

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState<UserType>('viewer')

    const shareDocHabdler = async () => {
        setLoading(true);
        await updateDocumentAcceess({ roomId, email, userType: userType as UserType, updatedBy: user.info });
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button className="gradient-blue flex h-9 gap-1 px-4" disabled={currentUserType !== 'editor'}>
                    <Image
                        src="/assets/icons/share.svg"
                        alt="share"
                        width={20}
                        height={20}
                        className="min-w-4 md:size-5 mr-2"
                    />
                    <p className="mr-1 hidden md:block">
                        Share
                    </p>
                </Button>
            </DialogTrigger>
            <DialogContent className="shad-dialog">
                <DialogHeader>
                    <DialogTitle>Manage who can view this project</DialogTitle>
                    <DialogDescription>
                        Select users can view and edit this document
                    </DialogDescription>
                </DialogHeader>
                <Label htmlFor="email" className="mt-6 text-blue-100">
                    Email address
                </Label>
                <div className="flex items-center gap-3">
                    <div className="flex flex-1 rounded-md bg-dark-400">
                        <Input
                            id="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="share-input"
                        />
                        <UserTypeSelector
                            userType={userType}
                            setUserType={setUserType}
                        />
                    </div>
                    <Button
                        type="submit"
                        onClick={shareDocHabdler}
                        className="gradient-blue flex h-full gap-1 px-5"
                        disabled={loading}
                    >
                        {loading? 'Sending...' : 'Invite'}
                    </Button>
                </div>
                <div className="my-2 space-y-2">
                    <ul className="flex flex-col">
                        {
                            collaborators.map((collab) => (
                                <Collaborator
                                    key={collab.id}
                                    roomId={roomId}
                                    creatorId={creatorId}
                                    email={collab.email}
                                    collaborator={collab}
                                    user={user.info}
                                />
                            ))
                        }
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareModal;