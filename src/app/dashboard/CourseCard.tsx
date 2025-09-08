'use client';
import './CourseCard.css'
import { useRouter } from 'next/navigation';

import { Dispatch, SetStateAction } from "react";

interface Course {
    id: string;
    title: string;
    description: string;
    level: string;
    price: number;
    index: number;
    status: string;
    coursesEnrolled:string[];
    setReload: Dispatch<SetStateAction<number>>;
}

interface CourseCardProps {
    element: Course;
}

export default function CourseCard(element: CourseCardProps) {
    const prop = element.element;
    const router = useRouter();
    return (
        <div className='popular'>
            <div className='save'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className='save_icon'>
                    <path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z" />
                </svg>
            </div>
            <div className='popular_deatils'>
                <div className='tag'>
                    <div className="weak">popular in week</div>
                    
                    <div className={prop.status.toLowerCase()}>{prop.status}</div>
                    {prop.coursesEnrolled.includes(prop.id)? <div className="enrolled">Enrolled</div>:<></> }
                </div>
                <div className={`data ${prop.level.toLowerCase()}`}>
                    <div className="admin_edit">
                        <h2>{prop.title}</h2>
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
                            <div>${prop.price}</div>
                            <s>${prop.price + Math.floor(prop.price / 100) * 25}</s>
                        </div>
                    </div>
                    <div className='enroll_btn'>
                        <button onClick={() => router.push('/course/' + prop.id)}>
                            View
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" ><g>
                                <path fill="#000000" d="M37.556,29.177c7.853,7.164,15.706,14.327,23.56,21.491c3.564,3.251,8.884-2.038,5.303-5.304   C58.565,38.2,50.712,31.037,42.859,23.873C39.295,20.622,33.976,25.911,37.556,29.177L37.556,29.177z" /></g><g><path fill="#000000" d="M61.039,45.364c-7.803,7.802-15.605,15.605-23.407,23.408c-3.422,3.423,1.881,8.726,5.304,5.303   c7.802-7.802,15.604-15.604,23.406-23.407C69.765,47.245,64.462,41.941,61.039,45.364L61.039,45.364z" /></g>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

};
