# BitX

## Overview
BitX เป็นแพลตฟอร์มที่ช่วยให้ผู้ใช้สามารถติดตามและวิเคราะห์ราคาสินทรัพย์ดิจิทัลแบบเรียลไทม์ พร้อมทั้งมีระบบการยืนยันตัวตน และการชำระเงินผ่าน Stripe

## Technologies Used
### Frontend
- **Next.js** - เฟรมเวิร์กที่ช่วยจัดการ UI และการโหลดข้อมูล
- **React.js** - ไลบรารีสำหรับสร้าง UI
- **TypeScript** - ป้องกันข้อผิดพลาดของโค้ด
- **Tailwind CSS** - ช่วยจัดการสไตล์ของ UI
- **Lucide Icons** - สำหรับไอคอนแบบ SVG

### Backend
- **Next.js API Routes** - ใช้เป็น backend API
- **Prisma** - ORM สำหรับจัดการฐานข้อมูล
- **Supabase** - ใช้แทน Firebase สำหรับ authentication และฐานข้อมูล

### APIs
- **CoinGecko API** - ดึงข้อมูลราคาคริปโตแบบเรียลไทม์
- **Stripe API** - ใช้สำหรับการชำระเงิน
- **Clerk API** - สำหรับระบบ Authentication

## Getting Started
### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/bitx.git
cd bitx
```

### 2. Install Dependencies
```bash
npm install  # or yarn install
```

### 3. Set Up Environment Variables
สร้างไฟล์ `.env.local` และกำหนดค่าต่อไปนี้(ดูค่า env ในรายงาน):
```env
DATABASE_URL="your_database_url"
DIRECT_URL="your_direct_database_url"
NEXT_PUBLIC_COIN_API="your_coingecko_api_key"
NEXT_PUBLIC_STRIPE_KEY="your_stripe_api_key"
```

### 4. Run Development Server
```bash
npm run dev  # or yarn dev or pnpm run dev
```
เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000) เพื่อดูผลลัพธ์

<!-- ## Deployment
แนะนำให้ใช้ [Vercel](https://vercel.com/) ในการ Deploy:
```bash
vercel
``` -->

<!-- ## Troubleshooting
### 1. ปัญหา "Module Not Found"
- ตรวจสอบให้แน่ใจว่า `paths` ใน `tsconfig.json` ถูกตั้งค่าให้รองรับ alias path
```json
"paths": {
  "@/*": ["./*"]
}
```
- ลองลบ `.next` แล้วรันใหม่
```bash
rm -rf .next && npm run dev
```

### 2. ปัญหาการเชื่อมต่อ Database
- ตรวจสอบว่า `DATABASE_URL` ถูกต้องและสามารถเข้าถึง Supabase ได้

### 3. ปัญหา Authentication (Clerk API)
- ตรวจสอบให้แน่ใจว่า Clerk API Key ถูกต้องและใช้งานในโหมดที่รองรับ

## Contributors
- [Your Name](https://github.com/your-profile)

## License
This project is licensed under the MIT License.
 -->
