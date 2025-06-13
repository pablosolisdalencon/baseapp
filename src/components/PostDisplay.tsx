import { Post } from '@/types/marketingWorkflowTypes';
import { ReactNode } from 'react';
import { useState, useEffect } from 'react';

interface PostModalProps {
    post: Post; 
}
interface PostFinal {
    title: string;
    foto: string;
    message: ReactNode;
}




const PostDisplay: React.FC<PostModalProps> = ({
    post

}) => {
           // MODAL POST

           const [isPostDisplayOpen, setIsPostDisplayOpen] = useState(false);
           const [postToDisplay, setPostToDisplay] = useState<Post | null>(null);
           setPostToDisplay(post)
   
           const [isPostGenerated, setIsPostGenerated] = useState(false);
           const [postGenerated, setPostGenerated] = useState<PostFinal | null>(null);

           const handleDisplayPost = (post: Post) => {
            setPostToDisplay(post);
            setIsPostDisplayOpen(true);
            };
    
    
    
            const closePostDisplay = () => {
            setIsPostDisplayOpen(false);
            }
            // MAKE POST api willi atack !!
            const crearPost = async () => {
                let post = postToDisplay;
                let bodyData = post;
                console.log(`######### postToDisplay ItemActual #########`)
                console.log(postToDisplay)
                console.log(`######### postToDisplay dataItemActual  #########`)
                console.log(postToDisplay)
                    const res = await fetch(`api/willi/post`,  {
                    method: "POST",
                    body: JSON.stringify(bodyData),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    });
                    const data = await res.json();
                    if(data){
                    console.log(data);
                    alert('post creado correctamente!');
                    
                    }else{
                    alert('Oops! no se ha creado el POST ')
                    }
                    
                    
                    
                };

                const publicPost = async () => {
                    console.log("PUBLICANDO")
                }

 useEffect(() => {




       

      


    },[]);



    if (!isPostDisplayOpen) return null;
    return(
        <div
            className='fixed inset-0 bg-black bg-opacity-50 flex item-center justify-center z-50'
            onClick={closePostDisplay}
        >
            <div
                className='bg-white rounded-lg p-6 max-w-sm w-full shadow-x1'
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className='text-lg font-medium mb-2'>ALgun Titulo</h3>
                <div className='text-gray-600 mb-6'><img className='mb-6' src="algunlugar.com/algo.jpg"/></div>
                <div className='text-gray-600 mb-6'>Algun texto...</div>
                <div className='flex justify-end space-x-3'>
                    <button 
                        onClick={closePostDisplay}
                        className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition focus:outline-none focus:ring-gray-400'
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={publicPost}
                        className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500'
                    >
                        Marcar como Publicado
                    </button>
                    <button
                        onClick={crearPost}
                        className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500'
                    >
                        Crear con Willi AI
                    </button>
                     
                </div>
            </div>
        </div>
    );
};

export default PostDisplay;