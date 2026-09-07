import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function PostBody({ body, image, postId }) {
  const navigate = useNavigate();
  return (
    <>
    {body && (
        <p onClick={()=>navigate(`/post-details/${postId}`)} className="px-5 pt-3 text-[15px] leading-relaxed text-[var(--color-text-primary)] whitespace-pre-line">
          {body}
        </p>
      )}
      {/* Image */}
      {image && (
        <img
          onClick={()=>navigate(`/post-details/${postId}`)}
          src={image}
          alt=""
          className="mt-3 w-full max-h-[520px] object-cover"
        />
      )}
    </>
  )
}
