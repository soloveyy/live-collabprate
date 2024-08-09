import React from "react";
import {Button} from "@/components/ui/button";
import Header from "@/components/Header";
import {SignedIn, UserButton} from "@clerk/nextjs";
import Image from "next/image";
import AddDocumentBtn from "@/components/AddDocumentBtn";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { deleteDocument, getAllDocuments } from "@/lib/actions/room.actions";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";
import DeleteRoomBtn from "@/components/DeleteRoomBtn";
import Notifications from "@/components/Notifications";

const Home = async () => {
    const clerkUser = await currentUser();
    if(!clerkUser) redirect('/sign-in')

    const roomDocuments = await getAllDocuments(clerkUser.emailAddresses[0].emailAddress)

    return (
        <main className="home-container">
            <Header className="sticky left-0 top-0">
                <div className="flex items-center gap-2 lg:gap-4">
                    <Notifications/>
                    <SignedIn>
                        <UserButton/>
                    </SignedIn>
                </div>
            </Header>

            {
                roomDocuments.data.length > 0 ? (
                    <div className="document-list-container">
                        <div className="document-list-title">
                            <h3 className="text-28-semibold">
                                All documents
                            </h3>
                            <AddDocumentBtn
                                userId={clerkUser.id}
                                email={clerkUser.emailAddresses[0].emailAddress}
                            />
                        </div>
                        <ul className="document-ul">
                            {roomDocuments.data.map((doc: any) => {
                                return (
                                    (
                                        <li
                                            key={doc.id}
                                            className="document-list-item"
                                        >
                                            <Link
                                                href={`/documents/${doc.id}`}
                                                className="flex flex-1 items-center gap-4"
                                            >
                                                <div className="hidden rounded-md border border-gray-300 p-2 sm:block">
                                                    <Image
                                                        src="/assets/icons/doc.svg"
                                                        alt="Doc"
                                                        width={40}
                                                        height={40}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="line-clamp-1 text-lg">{doc.metadata.title}</p>
                                                    <p
                                                        className="line-clamp-2 text-xs"
                                                    >
                                                        Created about {dateConverter(doc.createdAt)}
                                                    </p>
                                                </div>
                                            </Link>
                                            <DeleteRoomBtn roomId={doc.id}/>
                                        </li>
                                    )
                                )
                            })}
                        </ul>
                    </div>
                ) : (
                    <div className="document-list-empty">
                        <Image
                            src="/assets/icons/doc.svg"
                            alt="Document"
                            width={40}
                            height={40}
                            className="mx-auto"
                        />

                        <AddDocumentBtn
                            userId={clerkUser.id}
                            email={clerkUser.emailAddresses[0].emailAddress}
                        />
                    </div>
                )
            }
        </main>
    )
}

export default Home