# 🎓 Attendance Tracker App – *Bunk Matee*

A **personal college project** to simplify attendance tracking for students — built using **TypeScript** and **Supabase**.

🚀 **Live Website**: [https://bunk-matee.lovable.app](https://bunk-matee.lovable.app)

---

## ✨ Features

- 📧 **Email-based Sign In**: Simple and secure authentication via email using Supabase Auth.
- 📅 **Attendance Management**: Add and manage attendance entries for your subjects.
- 🚨 **Low Attendance Alerts**: Get notified when your attendance is near or below the required limit (e.g., 75%).
- 📊 **Visual Overview**: Clean dashboard to monitor your attendance across all courses.
- ✅ **Easy to Use**: Designed to help students quickly check and update their records.

---

## 🔧 Tech Stack

- **Frontend**: TypeScript + React (or plain TS if no framework)
- **Backend/Database**: [Supabase](https://supabase.com/) (Auth + Postgres DB)
- **Hosting**: Supabase + [Lovable.app](https://lovable.app) *(for frontend)*

---

## 📸 Screenshots *(Optional)*

> _Coming soon_ — Add screenshots or screen recordings of your app here to show how it works!

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/attendance-tracker.git
cd attendance-tracker
2. Install Dependencies
bash
Copy
Edit
npm install
# or
yarn install
3. Set Up Supabase
Go to Supabase and create a new project.

Set up:

Authentication → Enable Email Auth

Database → Create an attendance table with columns like:

id (UUID)

user_id (UUID)

subject (Text)

total_classes (Integer)

attended_classes (Integer)

Get your Supabase URL and Anon Key from project settings.

4. Configure Environment Variables
Create a .env file in the root:

env
Copy
Edit
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
5. Run the App
bash
Copy
Edit
npm run dev
# or
yarn dev
📐 Folder Structure (Example)
css
Copy
Edit
src/
├── components/
├── pages/
├── supabase/         # Supabase client init
├── utils/
├── App.tsx
├── main.tsx
🎯 Future Improvements
Push notifications for daily attendance

Export to CSV/PDF

Teacher/admin interface

Calendar integration

🙋‍♂️ Why I Built This
This is a personal tool I built to help myself keep track of attendance in college. It’s minimal, focused, and easy to expand on.

📄 License
This project is licensed under the MIT License — see the LICENSE file for details.

vbnet
Copy
Edit

You can create a new file called `README.md` in the root of your GitHub repo and paste this content 
