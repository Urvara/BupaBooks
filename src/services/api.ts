import axios from "axios";
import {Owner as BookOwner} from "../interfaces/types";

export const getOwners = async (): Promise<BookOwner[]> => {
  const { data } = await axios.get("/api/bookowners");
  return data;
};