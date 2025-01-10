import { createServerFn } from "@tanstack/start";
import { getAuth } from "@clerk/tanstack-start/server";
import { getWebRequest } from "vinxi/http";

export const getSignedInUserId = createServerFn({
  method: 'GET',
}).handler(async () => {
  const user = await getAuth(getWebRequest())
  console.log(user)
  return user?.userId
})
