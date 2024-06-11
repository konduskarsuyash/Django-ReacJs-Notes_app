import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg';

const NotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);

  useEffect(() => {
    getNote();
  }, [id]);

  const getNote = async () => {
    try {
      if (id === 'new') return;
      let response = await fetch(`http://localhost:8000/api/notes/${id}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();
      setNote(data);
    } catch (error) {
      console.error('There was an error fetching the note:', error);
    }
  };

  const updateNote = async () => {
    try {
      await fetch(`http://localhost:8000/api/notes/${id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
    } catch (error) {
      console.error('There was an error updating the note:', error);
    }
  };

  const createNote = async () => {
    try {
      await fetch(`http://localhost:8000/api/notes/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
    } catch (error) {
      console.error('There was an error creating the note:', error);
    }
  };

  const deleteNote = async () => {
    try {
      await fetch(`http://localhost:8000/api/notes/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      navigate('/'); // Navigate to the root path after successful deletion
    } catch (error) {
      console.error('There was an error deleting the note:', error);
    }
  };

  const handleSubmit = async () => {
    if (id !== 'new' && note.body === '') {
      deleteNote();
    } else if (id !== 'new') {
      await updateNote();
    } else if (id === 'new' && note !== null) {
      createNote();
    }
    navigate('/');
  };

  return (
    <div className='note'>
      <div className="note-header">
        <h3>
          <ArrowLeft onClick={handleSubmit} />
        </h3>
        {id !== 'new' ? (
          <button onClick={deleteNote}>Delete</button>
        ) : (
          <button onClick={handleSubmit}>Done</button>
        )}
      </div>
      <textarea
        onChange={(e) => {
          setNote({ ...note, 'body': e.target.value });
        }}
        value={note?.body}
      ></textarea>
    </div>
  );
};

export default NotePage;
