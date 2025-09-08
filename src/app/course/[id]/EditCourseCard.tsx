import { Course_Type } from '@/lib/types';
import { useEffect, useState } from 'react';
import "./EditCourseCard.css";

type AddCourseCardProps = {
    courseCard: React.Dispatch<React.SetStateAction<boolean>>;
    course: Course_Type | null;
    setCourse: React.Dispatch<React.SetStateAction<Course_Type | null>>;
};

export default function EditCourseCard({ courseCard, setCourse, course }: AddCourseCardProps) {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [level, setLevel] = useState('Beginner')
    const [status, setStatus] = useState('Upcoming')



    const [imageUrl, setImageUrl] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setTitle(course?.title || "")
        setDescription(course?.description || "")
        setPrice(course?.price.toString() || "")
        setLevel(course?.level || "Beginner")
        setImageUrl(course?.image || "")
        setStatus(course?.status || "Upcoming")
    }, [course])


    async function handleCourseAdd() {
        setError("");
        if (!title.trim()) {
            setError("Course title is required");
            return;
        } else if (title.length < 3 || title.length > 35) {
            setError("Course title requires 3 to 35 characters");
            return;
        }
        if (!description.trim()) {
            setError("Course description is required");
            return;
        }
        else if (description.length < 50 || description.length > 100) {
            setError("Course description requires 50 to 100 characters");
            return;
        }
        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
            setError("Please enter a valid price");
            return;
        }
        if (!imageUrl.trim()) {
            setError("Image URL is required");
            return;
        }
        const urlPattern = /^https:\/\/[^\s/$.?#].[^\s]*$/i;
        if (!urlPattern.test(imageUrl)) {
            setError("Please enter a valid image URL starting with https://");
            return;
        }
        setLoading(true)
        const mutation = `
mutation($updateCourseId:ID! , $courseTitle: String!, $imageUrl: String!, $description: String!, $price:String! ,$level: String! , $status : String!){
  updateCourse(courseId:$updateCourseId, courseTitle: $courseTitle, imageUrl: $imageUrl, description: $description,price:$price,  level: $level , status: $status) {
        id
  }
}
    `;
        const variables = {
            updateCourseId: course?.id,
            courseTitle: title,
            description,
            level,
            price,
            imageUrl,
            status
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
                setError(`Enrollment failed: ${result.errors[0].message}`)
                console.error('Enrollment failed:', result.errors);
                setLoading(false)
            } else {
                courseCard(false)
                const editedCourse: Course_Type = {
                    id: result.data.updateCourse.id,
                    title,
                    description,
                    level,
                    image: imageUrl,
                    price: Number(price),
                    status
                };

                setCourse(editedCourse);
                setLoading(false)

            }
        } catch (error) {
            console.error('Network error:', error);
            setLoading(false)
        }

        // setTitle("");
        // setDescription("");
        // setPrice("");
        // setImageUrl("");
    }
    return (
        <div className='add_course_cover'>
            <div className="add_course_card">
                <h3>Add New Course</h3>

                {error ?
                    <div className='err_msg'>
                        <i className="uil uil-exclamation-triangle text-red-600 text-1xl"></i>
                        <p>{error}</p>
                    </div>
                    :
                    <></>
                }
                <div className='coure_form'>
                    <label>Course Title</label>
                    <input type="text" placeholder="Enter course title (3-35) characters" value={title}
                        onChange={e => setTitle(e.target.value)} />

                    <label>Description</label>
                    <textarea placeholder="Enter course description (50-100) characters" value={description}
                        onChange={e => setDescription(e.target.value)}></textarea>

                    <label>Level</label>
                    <select value={level} onChange={e => setLevel(e.target.value)}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>


                    <label>Price ($)</label>
                    <input type="number" placeholder="Enter price" value={price}
                        onChange={e => setPrice(e.target.value)} />

                    <label>Course Image</label>
                    <input type="url" placeholder='Enter image URL' value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)} />


                    <label>Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Canceled">Canceled</option>

                    </select>
                    <div className='course_card_actions'>
                        <button type="submit" className='action_cancel' onClick={() => courseCard(false)}>Cancel</button>
                        <button type="submit" onClick={() => handleCourseAdd()}>
                            {
                                loading ? <div className="loader_25"></div> : "Edit Course"
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};
