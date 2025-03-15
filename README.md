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
- **Next.js** - ใช้เป็น Fetching Data in Client Components
- **Prisma** - ORM สำหรับจัดการฐานข้อมูล
- **Supabase** - ใช้แทน Firebase สำหรับ authentication และฐานข้อมูล

### APIs
- **CoinGecko API** - ดึงข้อมูลราคาคริปโตแบบเรียลไทม์
- **Stripe API** - ใช้สำหรับการชำระเงิน
- **Clerk API** - สำหรับระบบ Authentication

## Getting Started
### 1. Clone the Repository
```bash
git clone https://github.com/pp811010/bitx.git
cd bitx
```

### 2. Install Dependencies
```bash
pnpm i  # or yarn install
```

### 3. Set Up Environment Variables
สร้างไฟล์ `.env.local` และกำหนดค่าต่อไปนี้(ดูค่า env ในรายงาน):
```env
DATABASE_URL=""
DIRECT_URL=""
STRIPE_PUBLIC_KEY = ''
STRIPE_SECRET_KEY = ''
NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

### 4. Run Development Server
```bash
pnpm run dev  # or yarn dev or npm run dev
```
เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000) เพื่อดูผลลัพธ์

## Troubleshooting
### 1. ปัญหา "Module Not Found" หรือ "Cannot find module '.prisma/client/default'"
- ตรวจสอบให้แน่ใจว่า Prisma Client ถูกติดตั้ง:
  ```bash
  pnpm list @prisma/client
  ```
  ถ้ายังไม่มีให้ติดตั้ง:
  ```bash
  pnpm add @prisma/client
  ```
- รันคำสั่ง generate Prisma Client:
  ```bash
  pnpm prisma generate
  ```
- หากยังมีปัญหา ลองลบ `node_modules` และติดตั้งใหม่:
  ```bash
  rm -rf node_modules .prisma
  pnpm install
  pnpm prisma generate
  ```


