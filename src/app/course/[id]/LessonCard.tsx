'use-client'
import { Lesson_Type } from "@/lib/types";
import { useEffect, useState } from "react";

type props = {
    lesson: Lesson_Type
}
export default function LessonCard({ lesson }: props) {
    const [isEditing, setIsEditing] = useState(false);
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonDuration, setLessonDuration] = useState('');

    useEffect(() => {
        setLessonTitle(lesson.title);
        setLessonDuration(lesson.duration);
    }, [lesson])

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };


    const handleUpdate = async () => {
        const mutation = `
          mutation updateLesson($lessonId: ID!, $title: String!, $duration: String!) {
            updateLesson(lessonId: $lessonId, title: $title, duration: $duration) {
              id
              title
              duration
            }
          }
        `;

        const variables = {
            lessonId: lesson.id,
            title: lessonTitle,
            duration: lessonDuration
        };

        try {
            const res = await fetch('/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ query: mutation, variables })
            });

            const result = await res.json();

            if (result.errors) {
                alert(`Update failed: ${result.errors[0].message}`);
                console.error(result.errors);
            } else {
                lesson.title =lessonTitle;
                lesson.duration =lessonDuration
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this lesson?");
        if (!confirm) return;


        const mutation = `
          mutation deleteLesson($lessonId: ID!) {
            deleteLesson(lessonId: $lessonId) {
              id
              title
              duration
            }
          }
        `;

        const variables = { lessonId: lesson.id };

        try {
            const res = await fetch('/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ query: mutation, variables })
            });

            const result = await res.json();

            if (result.errors) {
                alert(`Delete failed: ${result.errors[0].message}`);
                console.error(result.errors);
            } else {
                alert('Lesson deleted successfully');
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };


    return (

        <div className="lesson">


            {!isEditing ? (
                <div className="lesson_info" id="lesson_info">
                    <div className="lesson_title">{lesson.title}</div>
                    <div className="lesson_duration">{lesson.duration}</div>
                </div>
            ) : (
                <div className="    lesson_info" id="lesson_info_edit">
                    <div className="lesson_title">
                        <input type="text" onChange={e => setLessonTitle(e.target.value)} value={lessonTitle} />
                    </div>
                    <div className="lesson_duration">
                        <input type="text" onChange={e => setLessonDuration(e.target.value)} value={lessonDuration} />
                    </div>
                </div>
            )}

            <div className="lesson_actions">
                {
                    isEditing ? <>
                        <span className="delete" onClick={handleEditClick}>
                            <button>Cancel</button>
                        </span>
                        <span className="save" onClick={handleUpdate}>
                            <button>Save</button>
                        </span>

                    </> :
                        <>
                            <span className="edit" onClick={handleEditClick}>
                                <button>edit</button>
                            </span>
                            <span className="delete" onClick={handleDelete}>
                                <button>Remove</button>
                            </span>
                        </>
                }

            </div>
        </div>

    );
}
