GameGearHub – Rent Gaming Devices in Bangalore
GameGearHub is a full-stack rental marketplace where users in Bangalore can list and rent gaming consoles, PCs, and accessories. It uses a legally compliant Bangalore-only map and includes secure login, listing creation, request approval, and real-time chat between renters and owners.
• 🚀 Live Demo:
• • Backend: https://gamegearhub.onrender.com
• • Frontend: https://gamegearhub-frontend.netlify.app
📌 Features
• ✅ Email/password authentication using JWT
• ✅ Custom user model and secure session handling
• ✅ List devices with image upload, pricing, dates, and Bangalore location
• ✅ Explore all public devices with real-time map markers
• ✅ Submit rental requests and approve/deny as owner
• ✅ Chat system tied to each rental request with support for image uploads
• ✅ Responsive Bootstrap design (mobile & desktop)
• ✅ Bangalore-only legal map via MapLibre and MapTiler
🧰 Tech Stack
• Frontend: React, Vite, React Bootstrap, MapLibre
• Backend: Django, Django REST Framework, SimpleJWT
• Database: PostgreSQL (Render Free Tier)
• Deployment: Docker, Render (backend), Netlify (frontend)
• Maps: MapLibre + MapTiler (legally bounded to BLR)
🛠️ Setup Instructions
⚙️ Backend (Django)
1. Clone the repo and navigate to backend directory:
git clone https://github.com/devwahi2010/GameGearHub.git
cd GameGearHub

2. Create `.env` file in backend with DB credentials and other secrets.
3. Start Docker:
docker compose up --build

4. Apply migrations and create superuser:
docker exec -it gamegearhub-web-1 python manage.py migrate
docker exec -it gamegearhub-web-1 python manage.py createsuperuser

💻 Frontend (React)
1. Navigate to frontend folder and install dependencies:
cd frontend
npm install

2. Create `.env` with your API and MapTiler key.
3. Run the app locally:
npm run dev

🧪 Key User Flows
• Explore Devices: Search by title or city, view devices on map, click 📍 to locate.
• Create Device: Fill form with image, price, dates, and select BLR map location.
• Request & Approve: Users request, owners approve/deny via dashboard.
• Chat: Chat opens after approval with timestamped messages and image support.
📈 Future Improvements
• ⭐ Ratings and reviews for renters and owners
• 📅 Calendar-based availability and scheduling
• 📲 SMS/Email notifications
• 🛡️ Payment integration and verification checks
👨‍💻 Author
Dev Wahi
B.Tech CSE (Cybersecurity) – Manipal Institute of Technology
LinkedIn: https://www.linkedin.com/in/devwahi
GitHub: https://github.com/devwahi2010
