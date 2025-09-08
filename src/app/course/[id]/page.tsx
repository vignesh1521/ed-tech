'use client';
import { useEffect, useState } from "react";
import "./course.css"
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";
import Image from 'next/image';
import { Course_Type } from "@/lib/types";
import { useAuth } from "@/context";
import EditCourseCard from "./EditCourseCard";

type Enrollment = {
  id: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
  course: Course_Type;
};
export default function CourseDetails() {

  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [coursesEnrolled, setCoursesEnrolled] = useState<string[]>([]);
  const { user } = useAuth();
  const router = useRouter();
  const [courseCard, openCourseCard] = useState(false)
  const params = useParams();
  const [course, setCourse] = useState<Course_Type | null>(null)
  const [imgSrc, setImgSrc] = useState(course?.image || '');


  useEffect(() => {

    const fetchCourseById = async () => {
      if (!user) return;
      setLoading(true)
      const query = `
                query GetCourseById($id: ID!) {
                    getCourseById(id: $id) {
                    id
                    title
                    level
                    description
                    image
                    price
                    status
                    }
                      
                getUserEnrolledCourses(id: ${user?.id}) {
                    course {
                        id
                    }
                
            }
                }
                          
                `;
      const variables = { id: params?.id };

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
          setLoading(false)
          return;
        }
        const coursesData = result.data.getUserEnrolledCourses.map((enrollment: Enrollment) => enrollment.course);
        const arr: string[] = [];
        coursesData.forEach((data: { id: string }) => {
          arr.push(data.id);
        });

        if (!result.data.getCourseById) return router.push('/dashboard')
        setCoursesEnrolled(arr);
        setCourse(result.data.getCourseById)
        setImgSrc(result.data.getCourseById.image)
        setLoading(false)

      } catch (err) {
        console.error('Network or GraphQL error:', err);
        setLoading(false)
      }
    };

    fetchCourseById();
  }, [router, params?.id, user])

  function ConfettiFullPage(myConfetti: confetti.CreateTypes) {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;

    (function frame() {
      myConfetti({
        particleCount: 10,
        spread: 560,
        startVelocity: 30,
        origin: {
          x: Math.random(),
          y: -0.5
        }
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    })();
  }
  function ConfettiBox() {
    const canvas = document.getElementById("canva") as HTMLCanvasElement | null;
    if (!canvas) return;

    canvas.style.display = "block";

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });
    ConfettiFullPage(myConfetti);
  }

  const enrollUser = async () => {
    setLoadingBtn(true)
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
      courseId: params?.id,
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
        setLoadingBtn(false)
      } else {
        const arr: string[] = [];
        arr.push(String(params?.id));
        setCoursesEnrolled(arr)
        ConfettiBox();
        setLoadingBtn(false)
      }
    } catch (error) {
      console.error('Network error:', error);
      setLoadingBtn(false)
    }
  };

  return (

    <>
      {
        loading ? <div className="loading"></div> :
          <div className="page">
            <canvas id="canva" className="confetti"></canvas>
            <div className="banner">

              <img
                src={course?.image}
                alt={course?.title}
                width={1200}
                height={400}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://placehold.co/1200x400/png?text=${encodeURIComponent(course?.title || 'Image Not Found')}`;
                }}
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div className="container">
              <div className="left">
                <h1 className="title">{course?.title}</h1>
                <p className="description">
                  {course?.description}
                </p>

                <div className="highlights">
                  <div className="highlight-box">
                    <p className="highlight-value"> {course?.level}</p>
                    <p className="highlight-label">Level</p>
                  </div>
                  <div className="highlight-box">
                    <p className="highlight-value">4.7</p>
                    <p className="highlight-label">Rating</p>
                  </div>
                  <div className="highlight-box">
                    <p className="highlight-value">English</p>
                    <p className="highlight-label">Language</p>
                  </div>
                  <div className="highlight-box">
                    <p className="highlight-value">{course?.status}</p>
                    <p className="highlight-label">status</p>
                  </div>

                </div>
              </div>

              <div className="right">
                <div className="purchase-box">
                  <p className="price">
                    ${course?.price}<span className="old-price">${course?.price ? course.price + Math.floor((course.price) / 100) * 25 : 0} </span>
                  </p>
                  <button className={coursesEnrolled.includes(course?.id ?? "") ? "btn disabled" : "btn enroll-btn"} onClick={coursesEnrolled.includes(course?.id ?? "") ? () => { } : () => enrollUser()}   >
                    {
                      !loadingBtn ?
                        "Enroll Now"
                        :
                        <div className="loader_black"></div>
                    }
                  </button>
                  {

                    user?.role == "admin" ? <button className="btn edit-btn" onClick={() => { openCourseCard(true) }}>Edit Coruse</button> : <></>
                  }
                  <button className="btn back-btn" onClick={() => { router.push('/dashboard') }}>Back Home</button>
                  <p className="guarantee">30-days money-back guarantee</p>
                </div>
              </div>
            </div>

            {
              courseCard ?
                <>
                  <EditCourseCard courseCard={openCourseCard} setCourse={setCourse} course={course} />
                </>
                :
                <>
                </>
            }
          </div>

      }

    </>
  );
}
