'use client';
import confetti from "canvas-confetti";
import { useState } from "react";
import './CourseCard.css'
import { useAuth } from "@/context";
import { Dispatch, SetStateAction } from "react";

interface Course {
    id: string;
    title: string;
    description: string;
    index: number;
    active: boolean;
    setReload: Dispatch<SetStateAction<number>>;
}

interface CourseCardProps {
    element: Course;
}

export default function CourseCard(element: CourseCardProps) {
    const [loading, setLoading] = useState(false);
    const prop = element.element;

    const { user } = useAuth();


    function ConfettiBox(canvasNum: number) {
        const canvases = document.getElementsByClassName("confetti") as HTMLCollectionOf<HTMLCanvasElement>;
        const canvas = canvases[canvasNum];
        canvas.style.display = "block";
        if (!canvas) return;
        const myConfetti = confetti.create(canvas, {
            resize: true,
            useWorker: true,
        });
        myConfetti({
            particleCount: 200,
            spread: 50,
            origin: { y: 0.7 },
        });
    }
    const handleEdit = async ( prop : Course) => {
        const newTitle = prompt("Enter the new title", prop.title)

        const mutation = `
      mutation($courseId: ID!, $courseTitle: String!){
  updateCourseTitle(courseId: $courseId, CourseTitle: $courseTitle) {
    id
    title
  }
}
    `;

        const variables = {
            courseId: prop.id,
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
                prop.setReload(Number(Date.now()))
            }
        } catch (error) {
            console.error('Network error:', error);
        }

    }

    const enrollUser = async (id: string, index: number) => {
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
                ConfettiBox(index);
                document.getElementById(id)?.classList.add('active')
                setLoading(false)
            }
        } catch (error) {
            console.error('Network error:', error);
            setLoading(false)
        }
    };

    return (
        <div className='popular'>
            <canvas className="confetti"></canvas>
            <div className='save'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className='save_icon'>
                    <path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z" />
                </svg>
            </div>
            <div className='popular_deatils'>
                <div className='tag'>
                    <div>popular in week</div>
                </div>
                <div className='data'>
                    <div className="admin_edit">
                        <h2>{prop.title}</h2>
                        {user?.role == "admin" ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" onClick={() => handleEdit(prop)}>
                                <path d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z" />
                            </svg>
                            :
                            <></>
                        }
                    </div>
                    <p>{prop.description}</p>
                </div>
                <div className='seperator'>
                    <span></span>
                </div>
                <div className='price_con'>
                    <div className='price'>
                        <div className='ratings'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z" />
                            </svg>
                            <div>
                                4.2
                            </div>
                        </div>
                        <div className='price_data'>
                            <div>$100.00</div>
                            <s>$150.00</s>
                        </div>
                    </div>
                    <div className='enroll_btn'>
                        <button className={prop.active ? "active" : ""} onClick={!prop.active ? () => enrollUser(prop.id, prop.index) : () => { }} id={prop.id}>
                            {
                                !loading ?
                                    <>
                                        Get Course
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" ><g>
                                            <path fill="#000000" d="M37.556,29.177c7.853,7.164,15.706,14.327,23.56,21.491c3.564,3.251,8.884-2.038,5.303-5.304   C58.565,38.2,50.712,31.037,42.859,23.873C39.295,20.622,33.976,25.911,37.556,29.177L37.556,29.177z" /></g><g><path fill="#000000" d="M61.039,45.364c-7.803,7.802-15.605,15.605-23.407,23.408c-3.422,3.423,1.881,8.726,5.304,5.303   c7.802-7.802,15.604-15.604,23.406-23.407C69.765,47.245,64.462,41.941,61.039,45.364L61.039,45.364z" /></g>
                                        </svg>
                                    </> :
                                    <div className="loader"></div>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

};
