'use client'

import React from 'react';
import {Button} from "@/components/ui/button";
import {deleteDocument, getAllDocuments} from "@/lib/actions/room.actions";
import {string} from "lib0";
import {redirect} from "next/navigation";

const DeleteRoomBtn = ({roomId}: {roomId: string}) => {

    const deleteDocumentHandler = async () => {
        await deleteDocument({roomId});
    }

    return (
        <Button
            variant="destructive"
            onClick={deleteDocumentHandler}
        >
            Delete room
        </Button>
    );
};

export default DeleteRoomBtn;