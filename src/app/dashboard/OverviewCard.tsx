'use client'
import { Course_Type } from "@/lib/types";
import "./OverviewCard.css"

type OverviewCardProps = {

    setActiveCard: React.Dispatch<React.SetStateAction<string>>;
    activeCard: string;
    courses: Course_Type[];
    coursesEnrolled: string[];
};

export default function OverviewCard({ setActiveCard, activeCard, courses, coursesEnrolled }: OverviewCardProps) {
    return (
        <>
            <h1>Courses Overview</h1>
            <div className='overview_con'>
                <div className={activeCard == "upcoming" ? 'overview active' : 'overview '} onClick={() => { setActiveCard('upcoming') }}>
                    <div className='overview_title'>
                        <div className='number'>
                            <p>{(courses.filter(c => c.status.toLowerCase() == 'upcoming').length)}</p>
                        </div>
                        <div className='title'>
                            <h2>Upcoming Courses</h2>
                            <p>All upcoming courses</p>
                        </div>
                    </div>
                    <div className='overview_details'>
                        <p>
                            View Details
                        </p>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" ><g>
                            <path fill="#000000" d="M37.556,29.177c7.853,7.164,15.706,14.327,23.56,21.491c3.564,3.251,8.884-2.038,5.303-5.304   C58.565,38.2,50.712,31.037,42.859,23.873C39.295,20.622,33.976,25.911,37.556,29.177L37.556,29.177z" /></g><g><path fill="#000000" d="M61.039,45.364c-7.803,7.802-15.605,15.605-23.407,23.408c-3.422,3.423,1.881,8.726,5.304,5.303   c7.802-7.802,15.604-15.604,23.406-23.407C69.765,47.245,64.462,41.941,61.039,45.364L61.039,45.364z" /></g>
                        </svg>
                    </div>
                </div>

                <div className={activeCard == "enrolled" ? 'overview active' : 'overview '} onClick={() => { setActiveCard('enrolled') }}>
                    <div className='overview_title'>
                        <div className='number'>
                            <p>{(courses.filter(c => ((c.status.toLowerCase() == 'ongoing' || c.status.toLowerCase() == 'upcoming') && coursesEnrolled.includes(c.id))).length)}</p>

                        </div>
                        <div className='title'>
                            <h2>Enrolled Courses</h2>
                            <p>ongoing / enrolled courses</p>
                        </div>
                    </div>
                    <div className='overview_details'>
                        <p>
                            View Details
                        </p>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" ><g>
                            <path fill="#000000" d="M37.556,29.177c7.853,7.164,15.706,14.327,23.56,21.491c3.564,3.251,8.884-2.038,5.303-5.304   C58.565,38.2,50.712,31.037,42.859,23.873C39.295,20.622,33.976,25.911,37.556,29.177L37.556,29.177z" /></g><g><path fill="#000000" d="M61.039,45.364c-7.803,7.802-15.605,15.605-23.407,23.408c-3.422,3.423,1.881,8.726,5.304,5.303   c7.802-7.802,15.604-15.604,23.406-23.407C69.765,47.245,64.462,41.941,61.039,45.364L61.039,45.364z" /></g>
                        </svg>
                    </div>
                </div>
                <div className={activeCard == "completed" ? 'overview active' : 'overview '} onClick={() => { setActiveCard('completed') }}>
                    <div className='overview_title'>
                        <div className='number'>
                            <p>{(courses.filter(c => (c.status.toLowerCase() == 'completed') && coursesEnrolled.includes(c.id)).length)}</p>


                        </div>
                        <div className='title'>
                            <h2>Completed  Courses</h2>
                            <p>Your compeleted courses</p>
                        </div>
                    </div>
                    <div className='overview_details'>
                        <p>
                            View Details
                        </p>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" ><g>
                            <path fill="#000000" d="M37.556,29.177c7.853,7.164,15.706,14.327,23.56,21.491c3.564,3.251,8.884-2.038,5.303-5.304   C58.565,38.2,50.712,31.037,42.859,23.873C39.295,20.622,33.976,25.911,37.556,29.177L37.556,29.177z" /></g><g><path fill="#000000" d="M61.039,45.364c-7.803,7.802-15.605,15.605-23.407,23.408c-3.422,3.423,1.881,8.726,5.304,5.303   c7.802-7.802,15.604-15.604,23.406-23.407C69.765,47.245,64.462,41.941,61.039,45.364L61.039,45.364z" /></g>
                        </svg>
                    </div>
                </div>
                <div className={activeCard == "total" ? 'overview active' : 'overview '} onClick={() => { setActiveCard('total') }}>
                    <div className='overview_title'>
                        <div className='number'>
                            <p>{courses.length}</p>
                        </div>
                        <div className='title'>
                            <h2>Total Courses</h2>
                            <p>All courses</p>
                        </div>
                    </div>
                    <div className='overview_details'>
                        <p>
                            View Details
                        </p>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" ><g>
                            <path fill="#000000" d="M37.556,29.177c7.853,7.164,15.706,14.327,23.56,21.491c3.564,3.251,8.884-2.038,5.303-5.304   C58.565,38.2,50.712,31.037,42.859,23.873C39.295,20.622,33.976,25.911,37.556,29.177L37.556,29.177z" /></g><g><path fill="#000000" d="M61.039,45.364c-7.803,7.802-15.605,15.605-23.407,23.408c-3.422,3.423,1.881,8.726,5.304,5.303   c7.802-7.802,15.604-15.604,23.406-23.407C69.765,47.245,64.462,41.941,61.039,45.364L61.039,45.364z" /></g>
                        </svg>
                    </div>
                </div>
            </div>
        </>
    )
};
