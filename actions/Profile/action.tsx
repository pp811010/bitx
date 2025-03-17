'use server'

import { currentUser } from "@clerk/nextjs/server";
import db from "@/utils/db";
import { CreateProfileResult } from "@/utils/allType";

export async function createProfile(): Promise<CreateProfileResult> {
  try {
    const user = await currentUser();
    if (!user) return { error: "User not found" };

    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const email = user.emailAddresses?.[0]?.emailAddress || "";

    const existingProfile = await db.profile.findUnique({
      where: { clerkId: user.id },
    });

    if (existingProfile) {
      return { success: true, profile: existingProfile };
    }

    const profile = await db.profile.create({
      data: { clerkId: user.id, firstName, lastName, email },
    });

    return { success: true, message: "Profile created", profile };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating profile:", error.message);
      return { success: false, error: "Something went wrong", details: error.message };
    }
    console.error("Unknown error:", error);
    return { success: false, error: "Unknown error", details: String(error) };
  }
}
