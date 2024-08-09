import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {cn} from "@/lib/utils";

type HeaderProps = {
    children: React.ReactNode,
    className?: string
}

const Header = ({children, className}: HeaderProps) => {
    return (
        <div className={cn("header", className)}>
            <Link href='/' className="md:flex-1">
                <div className="md:flex items-center hidden">
                    <Image
                        src="/assets/icons/envelope-yellow-office-document.svg"
                        alt="Logo"
                        width={32}
                        height={32}
                        className=""
                    />
                    <span style={{marginLeft: '10px', fontSize: '20px', fontWeight: 'bold'}}>
                      Live Collaboration
                    </span>
                </div>
                <div className="flex mr-2 items-center md:hidden">
                    <Image
                        src="/assets/icons/envelope-yellow-office-document.svg"
                        alt="Logo"
                        width={32}
                        height={32}
                    />
                    <span className="ml-2 font-bold text-sm">
                      Live Collaboration
                    </span>
                </div>
            </Link>
            {children}
        </div>
    );
};

export default Header;