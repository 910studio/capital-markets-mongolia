import { redirect } from "next/navigation";

export default function PastEventsRedirect() {
  redirect("/events#past");
}
