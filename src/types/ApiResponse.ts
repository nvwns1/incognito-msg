<<<<<<< HEAD
import { IMessage } from "@/model/User.model";
=======
import { IMessage } from "@/model/User";
>>>>>>> 3f31b618e627b117f5778ffab5b3b529932a5bf9

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<IMessage>;
}
