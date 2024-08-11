import { clerkMiddleware,createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const isPublicRoute= createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/home",
    "/"
])
const isPublicApiRoute=createRouteMatcher([
    "/api/videos"
])

export default clerkMiddleware((auth,req)=>{
    const {userId}=auth();
    const currentUrl=new URL(req.url)
    const isAccessingDashboard=currentUrl.pathname==="/home"
    const isApiRequest=currentUrl.pathname.startsWith("/api")

    if(userId && isPublicRoute(req )&& !isAccessingDashboard){
        return NextResponse.redirect(new URL("/home",req.url))
    }
    // not logged in 
    if(!userId){
        // if user is not logged in and trying to access a protected route
        if(!isPublicRoute(req) && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in",req.url))
        }
        // if user is not logged in and trying to access protected API
        if(isApiRequest && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in",req.url))
        }
    }
    return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)","/","/(api|trpc)(.*)"]
};