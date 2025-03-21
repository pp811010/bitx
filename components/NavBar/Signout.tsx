'use client'

import { useToast } from "@/hooks/use-toast"
import { SignOutButton } from '@clerk/nextjs'

const Signout = () => {
    const { toast } = useToast()

    const handlelogout = () => {
        toast({
            title: "Logout Succesful!!"
        })
    }

  return (
    <SignOutButton redirectUrl='/' >
      <button onClick={handlelogout}>Log out</button>
    </SignOutButton>
  )
}
export default Signout