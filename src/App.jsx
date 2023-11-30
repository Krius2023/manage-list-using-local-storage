import { useState, useEffect } from 'react';
import { MdOutlinePlaylistAdd, MdCancel, MdDelete } from 'react-icons/md';
import { GrClear } from 'react-icons/gr';
import { FaPencilAlt } from 'react-icons/fa';
import { TiTick } from 'react-icons/ti';
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [myList, setMyList] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [editIndex, setEditIndex] = useState()
  const [editContent, setEditContent] = useState('')

  const handleText = (e) => {
    let item = e.target.value;
    setText(item);
    console.log(text)
  }

  const handleEditContent = (e) => {
    let item = e.target.value.trim();
    setEditContent(item);
    console.log(text)
  }

  const addItem = () => {
    const listFromLS = localStorage.getItem('list');
    let listItems = listFromLS ? JSON.parse(listFromLS) : [];
    listItems = [...listItems, { item: text, isStriken: false }]

    console.log('inside add item:: ', text, myList, listItems);
    setMyList(listItems);
    localStorage.setItem('list', JSON.stringify(listItems));
    setText('');

    window.location.reload();
  }

  const clearLS = () => {
    setText('');
    localStorage.clear();
    window.location.reload();
  }

  const handleStrike = (index) => {
    let updatedItemStrike = myList.map((each, i) => {
      if (i === index) {
        return { ...each, isStriken: !each.isStriken }
      }
      return each
    });
    setMyList(updatedItemStrike);
    localStorage.setItem('list', JSON.stringify(updatedItemStrike));
  };

  const handleEdit = (index) => {
    setIsEdit(true);
    setEditIndex(index);
    const listFromLS = localStorage.getItem('list');
    let listItems = listFromLS ? JSON.parse(listFromLS) : [];
    setEditContent(listItems.find((each, i) => i === index).item);
  }

  const handleCancelEdit = () => {
    setIsEdit(false);
    setEditIndex();
    setEditContent();
  }

  const saveEditItem = (index) => {
    let updatedItems = myList.map((each, i) => i === index ? { ...each, item: editContent } : each);
    localStorage.setItem('list', JSON.stringify(updatedItems));
    setIsEdit(false);
    setEditIndex();
    setEditContent('');
    window.location.reload();
  }

  const handleDelete = (index) => {
    let updatedItems = myList.filter((each, i) => i != index);
    localStorage.setItem('list', JSON.stringify(updatedItems));
    window.location.reload();
  }

  useEffect(() => {
    let listFromLS = localStorage.getItem('list');
    let listItems = listFromLS ? JSON.parse(listFromLS) : [];
    setMyList(listItems);
  }, []);

  return (
    <>
      <div className="sm_sc">
        <h5>Currently, Manage List is not displayed in small screens. In progress.</h5>
      </div>
      <section>
        <h3 style={{ 'textAlign': 'center' }}>MANAGE LIST</h3>
        <div className='input_section'>
          <input type='text' value={text} onChange={e => handleText(e)} disabled={isEdit} />
          <button className='MdOutlinePlaylistAdd' onClick={addItem} disabled={!text.length}><MdOutlinePlaylistAdd /></button>
          <button onClick={clearLS} disabled={isEdit}><GrClear /></button>
        </div>

        {myList && myList?.length > 0 ?
          <div>
            <ul>
              {myList.map((myItem, index) => (

                <li key={index} style={{ textDecoration: myItem.isStriken ? 'line-through' : 'none' }}>
                  {editIndex !== index && <input type='checkbox' checked={myItem.isStriken} onChange={() => handleStrike(index)} disabled={isEdit} />}
                  {editIndex !== index && <span>{myItem.item}</span>}
                  {editIndex !== index && <button className='regular_buttons' onClick={() => handleEdit(index)} disabled={myItem.isStriken ? true : isEdit}><FaPencilAlt /></button>}
                  {editIndex !== index && <button onClick={() => handleDelete(index)} disabled={isEdit}><MdDelete /></button>}

                  {editIndex === index && <input type='text' value={editContent} onChange={e => handleEditContent(e)} />}
                  {editIndex === index && <button onClick={() => saveEditItem(index)} disabled={myItem.item === editContent}><TiTick /></button>}
                  {editIndex === index && <button onClick={handleCancelEdit}><MdCancel /></button>}
                </li>
              ))}
            </ul>
          </div> : ''
        }
      </section>
    </>
  )
}

export default App
