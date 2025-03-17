import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";
import { AlignRight } from 'lucide-react';
import Link from 'next/link';
import Signout from "./Signout";
import { SignedOut, SignedIn ,SignUpButton, SignInButton } from '@clerk/nextjs'

// const nav = [
//     { label: "Profile", href: '/profile' },
// ];

const Menu = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                    <AlignRight />
                </Button>
                
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="font-thin" >My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <SignedOut>
                        <DropdownMenuItem>
                            <SignInButton mode='modal'/>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <SignUpButton mode='modal'/>
                        </DropdownMenuItem>
                </SignedOut>

                <SignedIn>   
                    {/* {nav.map((item, index) => (
                        <Link key={index} href={item.href} passHref>
                            <DropdownMenuItem asChild>
                                <span>{item.label}</span>
                            </DropdownMenuItem>
                        </Link>
                    ))} */}
                        <DropdownMenuItem>
                            <Signout/>
                        </DropdownMenuItem>
                </SignedIn> 

            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Menu;
