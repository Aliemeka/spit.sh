import { revalidatePath } from "next/cache";

export const revalidateCurrentPath = (path: string) => {
  revalidatePath(path);
};
