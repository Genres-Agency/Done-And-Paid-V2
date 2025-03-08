import {
  PrismaClient,
  MediaType,
  UserRole,
  ReviewStatus,
  BlogStatus,
  ServiceStatus,
  AppointmentStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed media first
  console.log("Seeding media...");
  const mediaEntries = await prisma.$transaction([
    prisma.media.create({
      data: {
        title: "Dental Clinic Interior",
        url: "https://example.com/dental-clinic.jpg",
        type: MediaType.IMAGE,
        description: "Modern dental clinic interior",
        size: 1024 * 1024,
        mimeType: "image/jpeg",
      },
    }),
    prisma.media.create({
      data: {
        title: "Dental Treatment",
        url: "https://example.com/dental-treatment.jpg",
        type: MediaType.IMAGE,
        description: "Professional dental treatment",
        size: 512 * 1024,
        mimeType: "image/jpeg",
      },
    }),
    prisma.media.create({
      data: {
        title: "Dental Care Video",
        url: "https://example.com/dental-care.mp4",
        type: MediaType.VIDEO,
        description: "Dental care tutorial video",
        size: 15 * 1024 * 1024,
        mimeType: "video/mp4",
      },
    }),
  ]);
  console.log("✅ Media seeded successfully!");

  // Seed branches
  console.log("Seeding branches...");
  const branches = await prisma.$transaction([
    prisma.branch.create({
      data: {
        nameEn: "Smile Dental Main Branch",
        nameBn: "স্মাইল ডেন্টাল প্রধান শাখা",
        addressEn: "123 Main Street, Dhaka",
        addressBn: "১২৩ মেইন স্ট্রিট, ঢাকা",
        phoneNumber: "+880123456789",
        email: "main@smiledental.com",
        openingHours: "9:00 AM - 9:00 PM",
        image: "https://example.com/main-branch.jpg",
      },
    }),
    prisma.branch.create({
      data: {
        nameEn: "Smile Dental Chittagong",
        nameBn: "স্মাইল ডেন্টাল চট্টগ্রাম",
        addressEn: "45 Port Road, Chittagong",
        addressBn: "৪৫ পোর্ট রোড, চট্টগ্রাম",
        phoneNumber: "+880123456790",
        email: "chittagong@smiledental.com",
        openingHours: "10:00 AM - 8:00 PM",
        image: "https://example.com/chittagong-branch.jpg",
      },
    }),
  ]);
  console.log("✅ Branches seeded successfully!");

  // Seed services
  console.log("Seeding services...");
  await prisma.service.createMany({
    data: [
      {
        titleEn: "General Dental Checkup",
        titleBn: "সাধারণ ডেন্টাল চেকআপ",
        descriptionEn: "Comprehensive dental examination and cleaning",
        descriptionBn: "বিস্তৃত ডেন্টাল পরীক্ষা এবং পরিষ্কার",
        price: 1000,
        duration: "30 minutes",
        mediaId: mediaEntries[0].id,
        status: ServiceStatus.PUBLISHED,
      },
      {
        titleEn: "Root Canal Treatment",
        titleBn: "রুট ক্যানাল চিকিৎসা",
        descriptionEn: "Advanced root canal treatment with modern technology",
        descriptionBn: "আধুনিক প্রযুক্তির সাথে উন্নত রুট ক্যানাল চিকিৎসা",
        price: 15000,
        duration: "90 minutes",
        mediaId: mediaEntries[1].id,
        status: ServiceStatus.PRIVATE,
      },
      {
        titleEn: "Dental Implants",
        titleBn: "ডেন্টাল ইমপ্ল্যান্টস",
        descriptionEn: "Complete dental implant procedure with follow-up care",
        descriptionBn:
          "ফলো-আপ কেয়ার সহ সম্পূর্ণ ডেন্টাল ইমপ্ল্যান্ট প্রক্রিয়া",
        price: 50000,
        duration: "120 minutes",
        mediaId: mediaEntries[2].id,
        status: ServiceStatus.PUBLISHED,
      },
    ],
  });

  // Get all services to use their IDs
  const allServices = await prisma.service.findMany();
  console.log("✅ Services seeded successfully!");

  // Create users with different roles
  console.log("Seeding users...");
  const users = await prisma.$transaction([
    prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@gmail.com",
        password:
          "$2a$10$D32T4lzBzuucgBgqhUzqQ.KU2r.enUML9L0ihVcy8Odn0AdkOsuja", // "aaaaaa"
        role: UserRole.SUPERADMIN,
        branchId: branches[0].id,
        phoneNumber: "+880123456001",
        address: "Admin Address, Dhaka",
        bio: "Dental clinic administrator with 10 years of experience",
        isTwoFactorEnabled: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Dr. Sarah Smith",
        email: "sarah@smiledental.com",
        password:
          "$2a$10$D32T4lzBzuucgBgqhUzqQ.KU2r.enUML9L0ihVcy8Odn0AdkOsuja",
        role: UserRole.DENTIST,
        branchId: branches[0].id,
        phoneNumber: "+880123456002",
        address: "123 Doctor's Quarter, Dhaka",
        bio: "Specialized in Orthodontics with 15 years of experience",
        isTwoFactorEnabled: false,
      },
    }),
    prisma.user.create({
      data: {
        name: "Dr. Ahmed Khan",
        email: "ahmed@smiledental.com",
        password:
          "$2a$10$D32T4lzBzuucgBgqhUzqQ.KU2r.enUML9L0ihVcy8Odn0AdkOsuja",
        role: UserRole.DENTIST,
        branchId: branches[1].id,
        phoneNumber: "+880123456003",
        address: "45 Medical Road, Chittagong",
        bio: "Specialized in Dental Surgery with 10 years of experience",
        isTwoFactorEnabled: false,
      },
    }),
    prisma.user.create({
      data: {
        name: "John Doe",
        email: "john@gmail.com",
        password:
          "$2a$10$D32T4lzBzuucgBgqhUzqQ.KU2r.enUML9L0ihVcy8Odn0AdkOsuja",
        role: UserRole.PATIENT,
        phoneNumber: "+880123456004",
        address: "789 Patient Street, Dhaka",
        bio: "Regular dental care patient",
        isTwoFactorEnabled: false,
      },
    }),
    prisma.user.create({
      data: {
        name: "Staff Member",
        email: "staff@smiledental.com",
        password:
          "$2a$10$D32T4lzBzuucgBgqhUzqQ.KU2r.enUML9L0ihVcy8Odn0AdkOsuja",
        role: UserRole.STAFF,
        branchId: branches[0].id,
        phoneNumber: "+880123456005",
        address: "Staff Quarter, Dhaka",
        bio: "Dental clinic staff member",
        isTwoFactorEnabled: false,
      },
    }),
  ]);
  console.log("✅ Users seeded successfully!");

  // Seed blog posts
  console.log("Seeding blogs...");
  await prisma.blog.createMany({
    data: [
      {
        titleEn: "Importance of Regular Dental Checkups",
        titleBn: "নিয়মিত ডেন্টাল চেকআপের গুরুত্ব",
        slugEn: "importance-of-regular-dental-checkups",
        slugBn: "নিয়মিত-ডেন্টাল-চেকআপের-গুরুত্ব",
        contentEn:
          "Regular dental checkups are crucial for maintaining good oral health...",
        contentBn:
          "সুস্থ মুখের স্বাস্থ্য বজায় রাখার জন্য নিয়মিত ডেন্টাল চেকআপ অত্যন্ত গুরুত্বপূর্ণ...",
        categoryEn: "Dental Health",
        categoryBn: "ডেন্টাল স্বাস্থ্য",
        mediaId: mediaEntries[0].id,
        status: BlogStatus.PUBLISHED,
      },
      {
        titleEn: "Modern Dental Technologies",
        titleBn: "আধুনিক ডেন্টাল প্রযুক্তি",
        slugEn: "modern-dental-technologies",
        slugBn: "আধুনিক-ডেন্টাল-প্রযুক্তি",
        contentEn: "Discover the latest technologies in dental care...",
        contentBn: "ডেন্টাল কেয়ারে সর্বশেষ প্রযুক্তি সম্পর্কে জানুন...",
        categoryEn: "Technology",
        categoryBn: "প্রযুক্তি",
        mediaId: mediaEntries[1].id,
        status: BlogStatus.PUBLISHED,
      },
      {
        titleEn: "Dental Care Tips for Children",
        titleBn: "শিশুদের ডেন্টাল কেয়ার টিপস",
        slugEn: "dental-care-tips-for-children",
        slugBn: "শিশুদের-ডেন্টাল-কেয়ার-টিপস",
        contentEn:
          "Essential dental care tips for maintaining children's oral health...",
        contentBn:
          "শিশুদের মুখের স্বাস্থ্য রক্ষার জন্য প্রয়োজনীয় ডেন্টাল কেয়ার টিপস...",
        categoryEn: "Children's Dental Health",
        categoryBn: "শিশুদের ডেন্টাল স্বাস্থ্য",
        mediaId: mediaEntries[2].id,
        status: BlogStatus.SCHEDULED,
        scheduledAt: new Date("2024-03-01T09:00:00Z"),
      },
    ],
  });
  console.log("✅ Blogs seeded successfully!");

  // Seed reviews
  console.log("Seeding reviews...");
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        commentEn: "Excellent service and professional staff",
        commentBn: "চমৎকার সেবা এবং পেশাদার স্টাফ",
        status: ReviewStatus.APPROVED,
        userId: users[3].id, // John Doe
        mediaId: mediaEntries[0].id,
      },
      {
        rating: 4,
        commentEn: "Very good experience with modern facilities",
        commentBn: "আধুনিক সুবিধাসহ খুব ভালো অভিজ্ঞতা",
        status: ReviewStatus.APPROVED,
        userId: users[3].id,
        mediaId: mediaEntries[1].id,
      },
      {
        rating: 5,
        commentEn: "Dr. Sarah is an excellent dentist",
        commentBn: "ডাঃ সারাহ একজন চমৎকার দন্ত চিকিৎসক",
        status: ReviewStatus.PENDING,
        userId: users[3].id,
        mediaId: mediaEntries[2].id,
      },
    ],
  });
  console.log("✅ Reviews seeded successfully!");

  // Seed appointments
  console.log("Seeding appointments...");
  await prisma.appointment.createMany({
    data: [
      {
        patientId: users[3].id, // John Doe
        dentistId: users[1].id, // Dr. Sarah Smith
        serviceId: allServices[0].id,
        name: "John Doe",
        phone: "+880123456004",
        email: "john@gmail.com",
        date: new Date("2024-03-01T10:00:00Z"),
        status: AppointmentStatus.SCHEDULED,
        notes: "First time checkup",
        branchId: branches[0].id,
      },
      {
        patientId: users[2].id, // John Doe
        dentistId: users[1].id, // Dr. Sarah Smith
        serviceId: allServices[0].id, // General Dental Checkup
        name: "John Doe",
        phone: "+8801234567891",
        date: new Date("2024-03-01T10:00:00Z"),
        status: AppointmentStatus.SCHEDULED,
        notes: "First time checkup",
        branchId: branches[0].id,
      },
      {
        patientId: users[2].id,
        dentistId: users[1].id,
        serviceId: allServices[1].id, // Root Canal Treatment
        name: "John Doe",
        phone: "+8801234567891",
        date: new Date("2024-03-05T14:30:00Z"),
        status: AppointmentStatus.CONFIRMED,
        notes: "Follow-up treatment",
        branchId: branches[0].id,
      },
      {
        patientId: users[2].id,
        dentistId: users[1].id,
        serviceId: allServices[0].id,
        name: "John Doe",
        phone: "+8801234567891",
        date: new Date("2024-02-15T09:00:00Z"),
        status: AppointmentStatus.COMPLETED,
        notes: "Regular checkup completed",
        branchId: branches[0].id,
      },
    ],
  });
  console.log("✅ Appointments seeded successfully!");

  // Seed medical records
  console.log("Seeding medical records...");
  await prisma.medicalRecord.createMany({
    data: [
      {
        patientId: users[3].id, // John Doe
        diagnosis: "Mild gingivitis",
        treatment: "Professional cleaning and oral hygiene instructions",
        prescription:
          "Chlorhexidine mouthwash 0.12%, use twice daily for 2 weeks",
        notes: "Follow-up recommended in 3 months",
      },
      {
        patientId: users[3].id,
        diagnosis: "Dental caries on tooth #16",
        treatment: "Composite filling on upper right first molar",
        prescription: "Ibuprofen 400mg as needed for pain",
        notes: "Patient advised to avoid hard foods for 24 hours",
      },
      {
        patientId: users[3].id,
        diagnosis: "Routine dental checkup",
        treatment: "Dental cleaning and fluoride application",
        prescription: null,
        notes: "No significant findings. Next checkup in 6 months",
      },
    ],
  });
  console.log("✅ Medical records seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
