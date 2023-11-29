import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "~/client/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "~/client/login";

interface NavigationBarProps {
  children?: React.ReactNode;
}

const NavigationBar: React.FC<NavigationBarProps> = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">Configurar Eventos</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/visualize">Datos</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Cuenta</NavigationMenuTrigger>
          <NavigationMenuContent className="list-none">
            <div className="flex w-[340px] max-w-[90vw] flex-col space-y-4 p-4">
              {!loading && user && (
                <div className="flex items-center space-x-3 ">
                  <Avatar>
                    <AvatarImage src={user.photoURL ?? undefined} />
                    <AvatarFallback>
                      {user.email?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p>{user.email}</p>
                </div>
              )}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/settings">Configuración</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <Button onClick={signOut}>Cerrar sesión</Button>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationBar;
