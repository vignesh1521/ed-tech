import { gql } from 'apollo-server-micro';
import { users, CourseEnrolled } from './users';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { secret, requireAuth } from './auth';
import { Context_Type, Course_Type, Enrollment_Type, User_Type, Lesson_Type } from "./types";

let courses: Course_Type[] = [
    {
        id: '1',
        title: "Data Structures and Algorithms in C++",
        description: "Master the fundamentals of data structures and algorithms using C++.",
        level: "Beginner",
        image: "https://dme2wmiz2suov.cloudfront.net/User(91065251)/CourseBundles(47896)/3368275-C__.jpg",
        price: 1999,
        status: "Upcoming",

    },
    {
        id: '2',
        title: "Digital Marketing Advanced",
        description: "Explore advanced strategies in SEO, social media, email marketing, and analytics.",
        level: "Advanced",
        image: "https://dme2wmiz2suov.cloudfront.net/User(91065251)/CourseBundles(47903)/3368646-DM.jpeg",
        price: 2499,
        status: "Upcoming",

    },
    {
        id: '3',
        title: "UI/UX Design",
        description: "Learn the essentials of user interface and user experience design, including wireframing, prototyping.",
        level: "Beginner",
        image: "https://dme2wmiz2suov.cloudfront.net/User(91065251)/CourseBundles(47904)/3368666-UIUX.png",
        price: 1799,
        status: "Upcoming",

    },
    {
        id: '4',
        title: "Artificial Intelligence (English)",
        description: "Understand the core concepts of AI, machine learning, and neural networks, with hands-on examples.",
        level: "Intermediate",
        image: "https://dme2wmiz2suov.cloudfront.net/User(91065251)/CourseBundles(48278)/3409489-images.jpeg",
        price: 2999,
        status: "Upcoming",

    },
    {
        id: '5',
        title: "IOT",
        description: "Dive into the IOT and learn how smart devices communicate, collect, and share data in real-time.",
        level: "Beginner",
        image: "https://dme2wmiz2suov.cloudfront.net/User(91065251)/CourseBundles(48287)/3410681-iot.jpg",
        price: 1599,
        status: "Upcoming",

    },
    {
        id: '6',
        title: "Cyber Security & Ethical Hacking",
        description: "Gain hands-on knowledge of cyber threats, ethical hacking techniques.",
        level: "Intermediate",
        image: "https://dme2wmiz2suov.cloudfront.net/User(91065251)/CourseBundles(48304)/3412487-CS_photo.png",
        price: 2699,
        status: "Upcoming",
    }
];

const lessons: Lesson_Type[] = [
    { id: '1', courseId: '1', title: "Introduction to Data Structures", duration: "15" },
    { id: '2', courseId: '1', title: "Arrays and Linked Lists", duration: "22" },
    { id: '3', courseId: '1', title: "Sorting Algorithms", duration: "25" },

    { id: '4', courseId: '2', title: "Advanced SEO Strategies", duration: "18" },
    { id: '5', courseId: '2', title: "Social Media Campaigns", duration: "20" },

    { id: '6', courseId: '3', title: "Principles of UI Design", duration: "14" },
    { id: '7', courseId: '3', title: "Wireframing and Prototyping", duration: "21" },

    { id: '8', courseId: '4', title: "Introduction to AI Concepts", duration: "18" },
    { id: '9', courseId: '4', title: "Machine Learning Basics", duration: "23" },

    { id: '10', courseId: '5', title: "What is IoT?", duration: "13" },
    { id: '11', courseId: '5', title: "IoT Protocols and Communication", duration: "19" },

    { id: '12', courseId: '6', title: "Cyber Security Fundamentals", duration: "16" },
    { id: '13', courseId: '6', title: "Ethical Hacking Techniques", duration: "22" }
];

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    username: String!
    role: String!
  }


  type Course {
    id: ID!
    title: String!
    description: String!
    level: String!
    image : String!
    price : Int!
    status : String!
  }

   type Lesson {
    id: ID!
    courseId: ID!
    title: String!
    duration: String!
    }

  type Enrollment {
  id: ID!
  user: User!
  course: Course!
  }
  type Query {
    me: User
    getUsers: [User]
    getLessonsByCourseId(courseId: ID!): [Lesson]
    getCourses: [Course]
    getCourseById (id : ID!): Course
    getUserEnrolledCourses(id : ID!) : [Enrollment] 
  }

  type Mutation {
    login(email: String!, password: String!): String
    signup(email: String!, username: String!, password: String!): [User]
    createCourse(title: String!): Course
    enrollUser(courseId: ID!): Enrollment
    updateCourseTitle(courseId: ID! , CourseTitle: String!) : Course
    addNewCourse(courseTitle: String!, imageUrl:String! ,price:String!,  description:String!,level:String!): Course
    updateCourse(courseId:ID! , courseTitle: String!, imageUrl:String! ,price:String!,  description:String!,level:String! , status : String!): Course
    deleteCourse(CourseId : ID!):[Course]
    addLesson(courseId: ID!, title: String!, duration: String!): Lesson
    updateLesson(lessonId: ID!, title: String!, duration: String!): Lesson
    deleteLesson(lessonId: ID!): [Lesson]
  }
`;

export const resolvers = {
    Query: {
        me: (_: unknown, __: unknown, { user }: Context_Type) => user || null,
        getUsers: requireAuth((_: unknown, __: unknown, { user }: Context_Type) => {
            if (user?.role !== 'admin') {
                throw new Error('Access denied');
            }

            return users
        }),
        getCourses: requireAuth(() => courses),

        getLessonsByCourseId: requireAuth((_: unknown, { courseId }: { courseId: string }) => {
            return lessons.filter(lesson => lesson.courseId === courseId);
        }),

        getUserEnrolledCourses: requireAuth((_: unknown, { id }: { id: string }, { user }: Context_Type) => {
            if (user?.id != id) throw new Error('Access denied');
            return CourseEnrolled.filter((enrollment: Enrollment_Type) => enrollment.user.id == id);
        }),
        getCourseById: requireAuth((_: unknown, { id }: { id: string }) => {
            return courses.find(course => course.id == id)
        })
    },

    Mutation: {
        login: async (_: unknown, { email, password }: User_Type) => {
            const user = users.find((u: User_Type) => u.email === email);
            if (!user) throw new Error('User not found');

            const valid = await bcrypt.compare(password, user.password);

            if (!valid) throw new Error('Invalid password');

            return jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, secret, { expiresIn: '1h' });
        },

        signup: (_: unknown, args: { email: string; username: string; password: string }) => {
            const { email, username, password } = args;

            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            const newUser = {
                id: String(users.length + 1),
                email,
                username,
                password: bcrypt.hashSync(password, 10),
                role: "user",
            };

            users.push(newUser);
            return users

        },

        enrollUser: requireAuth((_: unknown, { courseId }: { courseId: string }, { user, CourseEnrolled }: Context_Type) => {
            if (!user) {
                throw new Error("Authentication required");
            }
            const course = courses.find(c => c.id == courseId);
            if (!course) {
                throw new Error("Course not found");
            }
            const alreadyEnrolled = CourseEnrolled.find(e => e.user.id == user.id && e.course.id == courseId);
            if (alreadyEnrolled) {
                throw new Error("User already enrolled in this course");
            }
            const enrollment = {
                id: String(Number(CourseEnrolled.length - 1) >= 0 ? Number(CourseEnrolled[CourseEnrolled.length - 1].id) + 1 : 0),
                user,
                course
            };
            CourseEnrolled.push(enrollment);
            return enrollment;
        }),

        updateCourseTitle: requireAuth((_: unknown, { courseId, CourseTitle }: { courseId: string; CourseTitle: string }, { user }: Context_Type) => {
            const crs = courses.find(c => c.id == courseId) || null
            if (user?.role !== 'admin') {
                throw new Error('Access denied');
            }
            if (!crs) {
                return null
            }
            crs.title = CourseTitle
            return crs
        }),

        updateCourse: requireAuth((_: unknown, { courseId, courseTitle, imageUrl, description, level, price, status }: { courseId: string; courseTitle: string, imageUrl: string, description: string, level: string, price: number, status: string }, { user }: Context_Type) => {
            console.log(courseTitle);
            const crs = courses.find(c => c.id == courseId) || null
            if (user?.role !== 'admin') {
                throw new Error('Access denied');
            }
            if (!crs) {
                return null
            }
            console.log(crs);
            crs.title = courseTitle
            crs.image = imageUrl
            crs.description = description
            crs.level = level
            crs.price = price
            crs.status = status
            return crs
        }),

        addNewCourse: (_: unknown, { courseTitle, imageUrl, description, level, price }: { courseTitle: string, imageUrl: string, description: string, level: string, price: number }) => {

            const newCourse = {
                id: String(Number(courses[courses.length - 1].id) + 1),
                title: courseTitle,
                image: imageUrl,
                description,
                level,
                price,
                status: "Upcoming"
            }

            courses.push(newCourse)
            return newCourse
        },
        deleteCourse: (_: unknown, { CourseId }: { CourseId: string }) => {
            courses = courses.filter(crc => crc.id != CourseId);
            return courses
        },

        addLesson: requireAuth((_: unknown, { courseId, title, duration }: { courseId: string, title: string, duration: string }) => {
            const newLesson = {
                id: String(lessons.length + 1),
                courseId,
                title,
                duration
            };

            lessons.push(newLesson);
            return newLesson;
        }),

        updateLesson: requireAuth((_: unknown, { lessonId, title, duration }: { lessonId: string, title: string, duration: string }) => {
            const lesson = lessons.find(l => l.id === lessonId);
            if (!lesson) {
                throw new Error("Lesson not found");
            }

            lesson.title = title;
            lesson.duration = duration;

            return lesson;
        }),

        deleteLesson: requireAuth((_: unknown, { lessonId }: { lessonId: string }) => {
            const index = lessons.findIndex(l => l.id === lessonId);
            if (index === -1) {
                throw new Error("Lesson not found");
            }

            lessons.splice(index, 1);

            return lessons;
        }),
    }
};

