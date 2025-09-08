'use client';

import { useAuth } from '@/context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './dashboard.css'
import CourseCard from './CourseCard';
import OverviewCard from './OverviewCard';
import AddCourseCard from './AddCourseCard';
import { Course_Type } from '@/lib/types';

export default function Dashboard() {

    type Enrollment = {
        id: string;
        user: {
            id: string;
            email: string;
            username: string;
        };
        course: Course_Type;
    };
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course_Type[]>([])
    const [coursesEnrolled, setCoursesEnrolled] = useState<string[]>([]);
    const [reload, setReload] = useState(1)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');
    // const [activeMenu, setActiveMenu] = useState("home")
    const [menu, setMenu] = useState(false);
    const [notify, setNotify] = useState(false);
    const [lang, setLang] = useState(false);

    const [activeCard, setActiveCard] = useState<string>("upcoming")
    const [courseCard, openCourseCard] = useState(false)
    const router = useRouter();


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
                    price
                    status
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

    }, [router, user, reload])


    useEffect(() => {
        const page = document.getElementById('main2');

        function handleClick(event: MouseEvent) {
            const clickedElement = event.target as HTMLElement;
            const classNames = clickedElement.classList;
            if (lang && !classNames.contains('language_drop ') && !classNames.contains('language_flag') && !classNames.contains('lang_span')) {
                setLang(false)
            } else if (!lang && classNames.contains('lang_icon')) {
                setLang(true)
            }

            if (notify && !classNames.contains('msg')) {
                setNotify(false)
            }
            else if (!notify && classNames.contains('notification_icon') || classNames.contains('notification')) {
                setNotify(true)
            }

            if (menu && !classNames.contains('log_out') && !classNames.contains('logout_icon')) {
                console.log("object");
                setMenu(false)
            }
            else if (!menu && classNames.contains('menu_click')) {
                console.log("2object");
                setMenu(true)
            }
        }

        page?.addEventListener('click', handleClick);

        return () => {
            page?.removeEventListener('click', handleClick);
        };
    }, [menu, notify, lang]);


    // function handleMenu(active_menu: string) {
    //     setActiveMenu(active_menu);
    // }

    return (
        <>
            <div className='main2' id='main2'>
                {/* <div className='menu_options'>
                        <div className='menu_container'>
                            <div className='icon_logo'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" >
                                    <defs>
                                        <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" className='point1' />
                                            <stop offset="100%" className='point2' />
                                        </linearGradient>
                                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                            <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
                                        </filter>
                                    </defs>
                                    <path d="M320 205.3L320 514.6L320.5 514.4C375.1 491.7 433.7 480 492.8 480L512 480L512 160L492.8 160C450.6 160 408.7 168.4 369.7 184.6C352.9 191.6 336.3 198.5 320 205.3zM294.9 125.5L320 136L345.1 125.5C391.9 106 442.1 96 492.8 96L528 96C554.5 96 576 117.5 576 144L576 496C576 522.5 554.5 544 528 544L492.8 544C442.1 544 391.9 554 345.1 573.5L332.3 578.8C324.4 582.1 315.6 582.1 307.7 578.8L294.9 573.5C248.1 554 197.9 544 147.2 544L112 544C85.5 544 64 522.5 64 496L64 144C64 117.5 85.5 96 112 96L147.2 96C197.9 106 248.1 106 294.9 125.5z"
                                        fill="url(#bookGradient)" filter="url(#shadow)" />
                                </svg>
                            </div>

                            <div className='icon_options'>
                                {
                                    activeMenu == "home" ?
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className='active_menu' >
                                                <defs>
                                                    <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" className='point1' />
                                                        <stop offset="100%" className='point2' />
                                                    </linearGradient>
                                                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                                        <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
                                                    </filter>
                                                </defs>
                                                <path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" fill="url(#bookGradient)" filter="url(#shadow)" />
                                            </svg>
                                        </>
                                        :
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" onClick={() => handleMenu("home")} className='menu_icon'>
                                                <defs>
                                                    <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" className='point1' />
                                                        <stop offset="100%" className='point2' />
                                                    </linearGradient>
                                                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                                        <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
                                                    </filter>
                                                </defs>
                                                <path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />
                                            </svg>
                                        </>
                                }

                                {
                                    activeMenu == "view" ?
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className='active_menu' >

                                                <defs>
                                                    <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" className='point1' />
                                                        <stop offset="100%" className='point2' />
                                                    </linearGradient>
                                                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                                        <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
                                                    </filter>
                                                </defs>
                                                <path d="M128 160C128 124.7 156.7 96 192 96L544 96C579.3 96 608 124.7 608 160L608 400L512 400L512 384C512 366.3 497.7 352 480 352L416 352C398.3 352 384 366.3 384 384L384 400L254.9 400C265.8 381.2 272 359.3 272 336C272 265.3 214.7 208 144 208C138.6 208 133.2 208.3 128 209L128 160zM333 512C327.9 487.8 316.7 465.9 300.9 448L608 448C608 483.3 579.3 512 544 512L333 512zM64 336C64 291.8 99.8 256 144 256C188.2 256 224 291.8 224 336C224 380.2 188.2 416 144 416C99.8 416 64 380.2 64 336zM0 544C0 491 43 448 96 448L192 448C245 448 288 491 288 544C288 561.7 273.7 576 256 576L32 576C14.3 576 0 561.7 0 544z" fill="url(#bookGradient)" filter="url(#shadow)" />
                                            </svg>
                                        </>
                                        :
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" onClick={() => handleMenu('view')} className='menu_icon'>
                                                <defs>
                                                    <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" className='point1' />
                                                        <stop offset="100%" className='point2' />
                                                    </linearGradient>
                                                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                                        <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
                                                    </filter>
                                                </defs>
                                                <path d="M128 160C128 124.7 156.7 96 192 96L544 96C579.3 96 608 124.7 608 160L608 400L512 400L512 384C512 366.3 497.7 352 480 352L416 352C398.3 352 384 366.3 384 384L384 400L254.9 400C265.8 381.2 272 359.3 272 336C272 265.3 214.7 208 144 208C138.6 208 133.2 208.3 128 209L128 160zM333 512C327.9 487.8 316.7 465.9 300.9 448L608 448C608 483.3 579.3 512 544 512L333 512zM64 336C64 291.8 99.8 256 144 256C188.2 256 224 291.8 224 336C224 380.2 188.2 416 144 416C99.8 416 64 380.2 64 336zM0 544C0 491 43 448 96 448L192 448C245 448 288 491 288 544C288 561.7 273.7 576 256 576L32 576C14.3 576 0 561.7 0 544z" />
                                            </svg>
                                        </>
                                }

                                {
                                    activeMenu == "learn" ?
                                        <>

                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className='active_menu'>
                                                <defs>
                                                    <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" className='point1' />
                                                        <stop offset="100%" className='point2' />
                                                    </linearGradient>
                                                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                                        <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
                                                    </filter>
                                                </defs>
                                                <path d="M80 259.8L289.2 345.9C299 349.9 309.4 352 320 352C330.6 352 341 349.9 350.8 345.9L593.2 246.1C602.2 242.4 608 233.7 608 224C608 214.3 602.2 205.6 593.2 201.9L350.8 102.1C341 98.1 330.6 96 320 96C309.4 96 299 98.1 289.2 102.1L46.8 201.9C37.8 205.6 32 214.3 32 224L32 520C32 533.3 42.7 544 56 544C69.3 544 80 533.3 80 520L80 259.8zM128 331.5L128 448C128 501 214 544 320 544C426 544 512 501 512 448L512 331.4L369.1 390.3C353.5 396.7 336.9 400 320 400C303.1 400 286.5 396.7 270.9 390.3L128 331.4z" fill="url(#bookGradient)" filter="url(#shadow)" />
                                            </svg>

                                        </>
                                        :
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className='menu_icon' onClick={() => { handleMenu('learn') }}>
                                                <defs>
                                                    <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" className='point1' />
                                                        <stop offset="100%" className='point2' />
                                                    </linearGradient>
                                                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                                        <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
                                                    </filter>
                                                </defs>
                                                <path d="M80 259.8L289.2 345.9C299 349.9 309.4 352 320 352C330.6 352 341 349.9 350.8 345.9L593.2 246.1C602.2 242.4 608 233.7 608 224C608 214.3 602.2 205.6 593.2 201.9L350.8 102.1C341 98.1 330.6 96 320 96C309.4 96 299 98.1 289.2 102.1L46.8 201.9C37.8 205.6 32 214.3 32 224L32 520C32 533.3 42.7 544 56 544C69.3 544 80 533.3 80 520L80 259.8zM128 331.5L128 448C128 501 214 544 320 544C426 544 512 501 512 448L512 331.4L369.1 390.3C353.5 396.7 336.9 400 320 400C303.1 400 286.5 396.7 270.9 390.3L128 331.4z" />
                                            </svg>
                                        </>
                                }

                                {
                                    activeMenu == "settings" ?
                                        <>

                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className='active_menu'>
                                                <defs>
                                                    <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" className='point1' />
                                                        <stop offset="100%" className='point2' />
                                                    </linearGradient>
                                                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                                        <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
                                                    </filter>
                                                </defs>
                                                <path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z" fill="url(#bookGradient)" filter="url(#shadow)" />
                                            </svg>

                                        </>
                                        :
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className='menu_icon' onClick={() => { handleMenu('settings') }}>
                                                <defs>
                                                    <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" className='point1' />
                                                        <stop offset="100%" className='point2' />
                                                    </linearGradient>
                                                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                                        <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
                                                    </filter>
                                                </defs>

                                                <path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z" />

                                            </svg>
                                        </>
                                }

                            </div>
                        </div>
                    </div> */}
                <div className='course_con'>
                    <div className="dashboard">
                        <div className='header'>
                            <div className='search_box'>
                                <input type="search" placeholder='Search Something....' onChange={e => setSearchTerm(e.target.value)} />
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" >
                                    <path d="M89.4,87.5L69.5,67.6c12.2-13.2,11.9-33.7-0.9-46.6c-6.6-6.6-15.2-9.8-23.7-9.8s-17.2,3.3-23.7,9.8C8,34.2,8,55.5,21.1,68.6  c6.6,6.6,15.2,9.8,23.7,9.8c8.2,0,16.4-3,22.8-8.9l19.9,19.9c0.3,0.3,0.6,0.4,0.9,0.4c0.3,0,0.7-0.1,0.9-0.4  C89.9,88.9,89.9,88,89.4,87.5z M44.8,75.8c-8.3,0-16.1-3.2-21.9-9.1c-12.1-12.1-12.1-31.8,0-43.8c5.9-5.9,13.6-9.1,21.9-9.1  s16.1,3.2,21.9,9.1c12.1,12.1,12.1,31.8,0,43.8C60.9,72.6,53.1,75.8,44.8,75.8z" /></svg>
                            </div>
                            <div className='header_icons'>

                                <div className='language menu'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className='lang_icon menu_icon'>
                                        <path className='lang_icon' d="M119.7 263.7L150.6 294.6C156.6 300.6 164.7 304 173.2 304L194.7 304C203.2 304 211.3 307.4 217.3 313.4L246.6 342.7C252.6 348.7 256 356.8 256 365.3L256 402.8C256 411.3 259.4 419.4 265.4 425.4L278.7 438.7C284.7 444.7 288.1 452.8 288.1 461.3L288.1 480C288.1 497.7 302.4 512 320.1 512C337.8 512 352.1 497.7 352.1 480L352.1 477.3C352.1 468.8 355.5 460.7 361.5 454.7L406.8 409.4C412.8 403.4 416.2 395.3 416.2 386.8L416.2 352.1C416.2 334.4 401.9 320.1 384.2 320.1L301.5 320.1C293 320.1 284.9 316.7 278.9 310.7L262.9 294.7C258.7 290.5 256.3 284.7 256.3 278.7C256.3 266.2 266.4 256.1 278.9 256.1L313.6 256.1C326.1 256.1 336.2 246 336.2 233.5C336.2 227.5 333.8 221.7 329.6 217.5L309.9 197.8C306 194 304 189.1 304 184C304 178.9 306 174 309.7 170.3L327 153C332.8 147.2 336.1 139.3 336.1 131.1C336.1 123.9 333.7 117.4 329.7 112.2C326.5 112.1 323.3 112 320.1 112C224.7 112 144.4 176.2 119.8 263.7zM528 320C528 285.4 519.6 252.8 504.6 224.2C498.2 225.1 491.9 228.1 486.7 233.3L473.3 246.7C467.3 252.7 463.9 260.8 463.9 269.3L463.9 304C463.9 321.7 478.2 336 495.9 336L520 336C522.5 336 525 335.7 527.3 335.2C527.7 330.2 527.8 325.1 527.8 320zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320z" />
                                    </svg>
                                    {
                                        lang ? <div className='language_drop ' id='language_drop'>
                                            <div className='language_flag'>
                                                <span className='lang_span'>🇺🇸</span>
                                                <span className='lang_span'>English</span>
                                            </div>
                                        </div> : <></>
                                    }

                                </div>

                                <div className='notification menu'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className='notification_icon menu_icon'>
                                        <path d="M320 64C302.3 64 288 78.3 288 96L288 99.2C215 114 160 178.6 160 256L160 277.7C160 325.8 143.6 372.5 113.6 410.1L103.8 422.3C98.7 428.6 96 436.4 96 444.5C96 464.1 111.9 480 131.5 480L508.4 480C528 480 543.9 464.1 543.9 444.5C543.9 436.4 541.2 428.6 536.1 422.3L526.3 410.1C496.4 372.5 480 325.8 480 277.7L480 256C480 178.6 425 114 352 99.2L352 96C352 78.3 337.7 64 320 64zM258 528C265.1 555.6 290.2 576 320 576C349.8 576 374.9 555.6 382 528L258 528z" />
                                    </svg>
                                    {
                                        notify ? <div className='notify_drop ' id='notify_drop'>
                                            <div className='msg'>
                                                No Notification Found
                                            </div>
                                        </div> : <></>
                                    }

                                </div>

                                <div className='menu'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className='menu_click'>
                                        <path className='menu_click' d="M463 448.2C440.9 409.8 399.4 384 352 384L288 384C240.6 384 199.1 409.8 177 448.2C212.2 487.4 263.2 512 320 512C376.8 512 427.8 487.3 463 448.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 336C359.8 336 392 303.8 392 264C392 224.2 359.8 192 320 192C280.2 192 248 224.2 248 264C248 303.8 280.2 336 320 336z" />
                                    </svg>
                                    {
                                        menu ?
                                            <div className='menu_drop' id='menu_drop'>
                                                <div className="user-info">
                                                    <div className="user-avatar">{user?.username[0].toUpperCase()}</div>
                                                    <div className="user-details">
                                                        <h4>{user?.username}</h4>
                                                        <p>{user?.email}</p>
                                                    </div>
                                                </div>
                                                <div className='log_out' onClick={() => { localStorage.removeItem('token'); router.push('/login') }}>
                                                    <svg className="logout_icon" viewBox="0 0 24 24">
                                                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                                                    </svg>
                                                    Log Out
                                                </div>
                                            </div> :
                                            <></>
                                    }
                                </div>
                            </div>
                        </div>
                        {searchTerm.trim() !== '' ?
                            <>
                                <div className='popular_courses course_overview'>
                                    <h1>Search result for &quot;{searchTerm}&quot;</h1>
                                    <div className='popular_con'>
                                        {
                                            courses.filter((course) =>
                                                course.title.toLowerCase().includes(searchTerm.toLowerCase())).map((course, index) => (
                                                    <CourseCard
                                                        key={index}
                                                        element={{ ...course, index, setReload, coursesEnrolled }}
                                                    />
                                                ))
                                        }
                                    </div>
                                </div>
                            </> :
                            <div className='courses_data'>
                                <div className='course_overview'>
                                    <OverviewCard setActiveCard={setActiveCard} activeCard={activeCard} courses={courses} coursesEnrolled={coursesEnrolled} />
                                </div>
                                <div className='popular_courses course_overview'>
                                    <h1>{activeCard[0].toUpperCase() + activeCard.slice(1)} Courses</h1>

                                    <div className='popular_con'>
                                        {
                                            loading ? <div className="loading" style={{ marginTop: "150px" }}></div> :
                                                <>
                                                    {

                                                        (() => {
                                                            switch (activeCard) {
                                                                case "upcoming":
                                                                    return (courses.map((course, index) => {
                                                                        if (course.status.toLocaleLowerCase() == "upcoming")
                                                                            return <CourseCard key={index} element={{ ...course, index, setReload, coursesEnrolled }} />
                                                                    }))
                                                                case "enrolled":
                                                                    return (courses.map((course, index) => {
                                                                        if ((course.status.toLocaleLowerCase() == "ongoing" && coursesEnrolled.includes(course.id)) || (course.status.toLocaleLowerCase() == "upcoming" && coursesEnrolled.includes(course.id)))
                                                                            return <CourseCard key={index} element={{ ...course, index, setReload, coursesEnrolled }} />
                                                                    }))
                                                                case "completed":
                                                                    return (courses.map((course, index) => {
                                                                        if (course.status.toLocaleLowerCase() == "completed" && coursesEnrolled.includes(course.id))
                                                                            return <CourseCard key={index} element={{ ...course, index, setReload, coursesEnrolled }} />
                                                                    }))
                                                                case "total":
                                                                    return (courses.map((course, index) => {
                                                                        return <CourseCard key={index} element={{ ...course, index, setReload, coursesEnrolled }} />
                                                                    }))
                                                            }
                                                        })()

                                                    }
                                                    {
                                                        user?.role == "admin" ? <div className='popular add_card_con'>
                                                            <div className="add_card" onClick={() => openCourseCard(true)}>
                                                                <span className="plus">+</span>
                                                                <span className="text">Add New Course</span>
                                                            </div>
                                                        </div> : <></>
                                                    }
                                                </>
                                        }

                                    </div>

                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {
                courseCard ?
                    <>
                        <AddCourseCard courseCard={openCourseCard} setCourses={setCourses} courses={courses} />
                    </>
                    :
                    <>
                    </>
            }
        </>
    )
}
