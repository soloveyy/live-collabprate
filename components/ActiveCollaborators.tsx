import React from 'react';
import {useOthers} from "@liveblocks/react/suspense";
import Image from "next/image";

const ActiveCollaborators = () => {
    const others = useOthers()
    const collabolators = others.map((other) => other.info)
    return (
        <ul className="collaborators-list">
            {collabolators.map(({id, name, avatar, color}) => (
                <li key={id}>
                    <Image
                        src={avatar}
                        alt={name}
                        width={100}
                        height={100}
                        className="inline-block size-8 rounded-full ring-2 right-dark-100"
                        style={{border: `3px solid ${color}`}}
                    />
                </li>
            ))}
        </ul>
    );
};

export default ActiveCollaborators;