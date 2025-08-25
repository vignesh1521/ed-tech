"use client"
import { useAuth } from "@/context";
// pages/courses.tsx
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
type Course = {
    id: string;
    title: string;
    level: string;
    description: string;
    image: string;
};
type Enrollment = {
    id: string;
    user: {
        id: string;
        email: string;
        username: string;
    };
    course: Course;
};


const CoursesPage: React.FC = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([])
    const [enrolled, setCoursesEnrolled] = useState<string[]>([]);
    const [loading, setLoading] = useState(true)
    const router = useRouter();


    const isAdmin = user?.role === "admin";

    const handleEnroll = async (id: string) => {
        setLoading(true)
        const mutation = `
      mutation enrollUser( $courseId: ID!) {
        enrollUser( courseId: $courseId) {
          id
          course {
            id
            title
          }
        }
      }
    `;

        const variables = {
            courseId: id,
        };

        try {
            const response = await fetch('/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ query: mutation, variables }),
            });

            const result = await response.json();

            if (result.errors) {
                alert(`Enrollment failed: ${result.errors[0].message}`)
                console.error('Enrollment failed:', result.errors);
                setLoading(false)
            } else {
                setLoading(false)
                setCoursesEnrolled((prev) => [...prev, id]);
            }
        } catch (error) {
            console.error('Network error:', error);
            setLoading(false)
        }
    };



    useEffect(() => {

        const fetchAllCourses = async () => {

            const query = `
                    query{
                    getCourses {
                    id
                    title
                    level
                    description
                    image   
                }
                }`;

            try {
                const response = await fetch('/api/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,

                    },
                    body: JSON.stringify({ query }),
                });

                const result = await response.json();


                if (result.errors) {
                    console.error('GraphQL error:', result.errors);
                    router.push('/login')
                    setLoading(false);
                    return;
                }
                setCourses(result.data.getCourses)
                console.log("Courses fetched:", result.data.getCourses);


            } catch (err) {
                console.error('Network or GraphQL error:', err);
            }
        };




        const fetchUserEnrolledCourses = async () => {

            const query = `
            query($getUserEnrolledCoursesId: ID!) {
                getUserEnrolledCourses(id: $getUserEnrolledCoursesId) {
                    course {
                        id
                    }
                }
            }
        `;

            const variables = {
                getUserEnrolledCoursesId: user?.id
            };

            try {
                const response = await fetch('/api/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ query, variables }),
                });

                const result = await response.json();

                if (result.errors) {
                    console.error('GraphQL error:', result.errors);
                    return;
                }

                const coursesData = result.data.getUserEnrolledCourses.map((enrollment: Enrollment) => enrollment.course);
                const arr: string[] = [];
                coursesData.forEach((data: { id: string }) => {
                    arr.push(data.id);
                });
                setCoursesEnrolled(arr);
            } catch (err) {
                console.error('Network or GraphQL error:', err);
            }
        };

        if (user?.id) {
            setLoading(true);
            const loadData = async () => {
                await Promise.all([
                    fetchAllCourses(),
                    fetchUserEnrolledCourses()
                ]);
                await setLoading(false);
            }
            loadData();
        }

    }, [router, user])


    const handleEdit = async (id: string, title: string, element: string) => {
        const newTitle = prompt("Enter the new title", title)

        const mutation = `
      mutation($courseId: ID!, $courseTitle: String!){
  updateCourseTitle(courseId: $courseId, CourseTitle: $courseTitle) {
    id
    title
  }
}
    `;

        const variables = {
            courseId: id,
            courseTitle: newTitle
        };

        try {
            const response = await fetch('/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`

                },
                body: JSON.stringify({ query: mutation, variables }),
            });

            const result = await response.json();

            if (result.errors) {
                alert(`Edit failed: ${result.errors[0].message}`)
                console.error('Edit failed:', result.errors);
            } else {
                const el = document.getElementById(element);
                console.log(el);
                if (el) {
                    el.textContent = newTitle;
                }
            }

        } catch (error) {
            console.error('Network error:', error);
        }

    }
    if (loading) { }

    return (
        <>
            <Head>
                <title>Course Catalog</title>
            </Head>

            <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <header className="flex items-center justify-between mb-10">
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                            Course Catalog
                        </h1>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-sm text-gray-600">Signed in</div>
                            </div>
                            <div
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${isAdmin ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white" : "bg-gray-200 text-gray-800"
                                    }`}
                                aria-hidden
                            >
                                {isAdmin ? "Admin" : "User"}
                            </div>
                        </div>
                    </header>

                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((c) => (
                            <article
                                key={c.id}
                                className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                                aria-labelledby={`course-title-${c.id}`}
                            >


                                <h2 id={`course-title-${c.id}`} className="text-xl font-semibold text-gray-900 mb-2">
                                    {c.title}
                                </h2>

                                <p className="text-gray-600 mb-4 line-clamp-3">{c.description}</p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <span className="px-2 py-1 rounded-md bg-gray-100">{c.level}</span>
                                        <span>•</span>
                                        <span>00:00</span>
                                    </div>

                                    <div className="text-sm text-gray-400">ID: {c.id}</div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleEnroll(c.id)}
                                        disabled={enrolled.includes(c.id)}
                                        className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-medium shadow-sm transition transform duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400
                      ${enrolled.includes(c.id)
                                                ? "bg-gray-300 text-gray-700 cursor-not-allowed scale-100"
                                                : "bg-gradient-to-r from-green-400 to-green-600 text-white hover:scale-105"}
                    `}
                                        aria-pressed={enrolled.includes(c.id)}
                                        aria-label={enrolled.includes(c.id) ? `Already enrolled in ${c.title}` : `Enroll in ${c.title}`}
                                    >
                                        {/* check icon when enrolled, plus when not */}
                                        {enrolled.includes(c.id) ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L7 12.172 4.707 9.879a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l9-9z" clipRule="evenodd" />
                                                </svg>
                                                Enrolled
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                                    <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                                                </svg>
                                                Enroll
                                            </>
                                        )}
                                    </button>

                                    {isAdmin && (
                                        <button
                                            onClick={() => handleEdit(c.id, c.title, `course-title-${c.id}`)}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400"
                                            aria-label={`Edit ${c.title}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                                <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.464.263l-4 1a1 1 0 01-1.213-1.213l1-4a1 1 0 01.263-.464l9.9-9.9a2 2 0 012.828 0z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-700">Edit</span>
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </section>
                </div>
            </main>
        </>
    );
};

export default CoursesPage;
