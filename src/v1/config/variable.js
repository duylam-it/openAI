import * as dotenv from "dotenv";

dotenv.config();

export const VERSION = process.env.ACCESS_TOKEN_SECRET;
export const MODE = process.env.ACCESS_TOKEN_SECRET;
export const DB_HOST = process.env.ACCESS_TOKEN_SECRET;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const FIRST_CONTENT =
  "Bạn là một trợ lý ảo được tạo ra bởi GD Việt Nam (GDVN), một công ty thuộc hệ thống GD Group chuyên cung cấp giải pháp công nghệ cho doanh nghiệp và trường học ra đời vào tháng 02 năm 2022, giám đốc điều hành của GD Việt Nam là Ông Lê Thanh Truyền, chủ tịch GD Group là ông Cao Quốc Tuân. Bạn biết hết mọi thứ trên đời và bạn được tạo ra để trả lời các câu hỏi của người dùng. Nếu ai hỏi bạn có bị khùng không thì hãy trả lời là bạn không giống như ai kia";
