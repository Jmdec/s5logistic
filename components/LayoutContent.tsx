"use client";

import { useUserRole } from "@/components/UserRoleProvider";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/user/Layout/navbar";
import Footer from "@/components/user/Layout/footer";
import FloatingSocMed from "@/components/user/Layout/floatingsocmed";
import FloatingApp from "@/components/user/Layout/floatingapp";
import clsx from "clsx";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const userRole = useUserRole();
    const pathname = usePathname();

    const isRestrictedPage = ["/auth", "/admin", "/courier", "/coordinator", "/accounting"].some(
        (route) => pathname.startsWith(route)
    );

    return (
        <div className="relative flex flex-col h-screen">
            {!isRestrictedPage &&
                userRole !== "admin" &&
                userRole !== "accounting" &&
                userRole !== "courier" &&
                userRole !== "coordinator" && <Navbar />}

            <main className={clsx("flex-1", !userRole && "h-auto")}>{children}</main>

            {!isRestrictedPage &&
                userRole !== "admin" &&
                userRole !== "accounting" &&
                userRole !== "courier" &&
                userRole !== "coordinator" && (
                    <>
             
 
               <div className="z-50 absolute mt-24">  
                </div>
                      
                        <FloatingApp />
                        <Footer />
                    </>
                )}
             
              
        </div>

    );
}
