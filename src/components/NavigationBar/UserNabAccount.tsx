import React from "react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,

  MenubarTrigger,
} from "@/components/ui/menubar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { USER_NAV_LINKS } from "@/data/staticData";
import { ChevronDown, CircleUserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";


const UserNabAccount = ({ imageUrl }: { imageUrl?: string | null | undefined }) => {
  const router = useRouter();
  const { logout } = useAuth()
  const handleClick = (link: string) => {
    switch (link) {
      case '/profile':
        router.push('/profile')
        break;
      case '/bookings':
        router.push('/bookings')
        break;
      case '/reviews':
        router.push('/reviews')
        break;
      case '/interest':
        router.push('/interest')
        break;
      case '/travel-hub':
        router.push('/travel-hub')
        break;
      case '/rewards':
        router.push('/rewards')
        break;
      case '/logout':
        logout();
        break;

    }
  }
  return (
    <Menubar className="rounded-full p-0 cursor-pointer hover:border-primary-100 hover:shadow-md transition-all duration-300">
      <MenubarMenu  >
        <MenubarTrigger className="flex items-center cursor-pointer gap-1  pl-[6px] pr-[6px] py-[4px] rounded-full">
          <Avatar>
            {imageUrl && <AvatarImage src={imageUrl} className="w-8 h-8 overflow-hidden object-cover rounded-full" alt="avatar" />}
            <AvatarFallback>
              <CircleUserRound />
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="w-5 h-5" />
        </MenubarTrigger>
        <MenubarContent align="end" className="bg-background min-w-[250px] space-y-2 p-4">
          {USER_NAV_LINKS.map((link) => (
            <MenubarItem onClick={() => handleClick(link.href!)} className="text-gray-800  text-base hover:bg-primary-50 duration-300 cursor-pointer" key={link.id}>{link.label}</MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default UserNabAccount;
