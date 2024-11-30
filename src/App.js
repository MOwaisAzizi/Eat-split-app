import react, { useState } from 'react'

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: require("./images/images-2.jpg"),
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: require("./images/images-4.jpg"),
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: require("./images/images-5.jpg"),
    balance: 0,
  },
];

function Button({ children, click }) {
  return (
    <button className="button" onClick={click}>{children}</button>
  )
}

export default function App() {

  const [showFormAddFrind, setshowFormAddFrind] = useState(false)
  const [friends, setFriends] = useState(initialFriends)
  const [selectedFrind, setSelectedFriend] = useState(null)

  function showFormAddFrindHandler() {
    setshowFormAddFrind(pre => !pre)
  }

  function AddFriendHandler(friend) {
    setFriends(friends => [...friends, friend])
    setshowFormAddFrind(false)
  }
  function selectionHandler(friend) {
    // setSelectedFriend(friend)
    setSelectedFriend(selectedFr => selectedFr?.id == friend.id ? null : friend)
  }

  function handleSplitBill(value) {
    setFriends(friends => friends.map(friend => friend.id == selectedFrind.id ? { ...friend, balance: friend.balance + value } : friend))
    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FrindList friends={friends} onSelection={selectionHandler} selectedFrind={selectedFrind} />
        {showFormAddFrind && <FormAddFrind onAddFriends={AddFriendHandler} />}
        <Button click={showFormAddFrindHandler}>{showFormAddFrind ? 'Close' : 'Add Friend'}</Button>
      </div>
      {selectedFrind && <FormSplitBill key={selectedFrind.id} selectedFriend={selectedFrind} onSplitBill={handleSplitBill} />}
    </div>
  )
}

function FrindList({ friends, onSelection, selectedFrind }) {
  return (
    <ul>
      {
        friends.map(frind => {
          return <Frinds frind={frind} onSelection={onSelection} selectedFrind={selectedFrind} />
        })
      }
    </ul>
  )
}


function Frinds({ frind, onSelection, selectedFrind }) {
  const isSelected = selectedFrind?.id == frind.id
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={frind.image} alt={frind.name} /> <h3>{frind.name}</h3>
      <p className={frind.balance > 0 ? 'green' : frind.balance < 0 ? 'red' : ''}>
        {frind.balance == 0 ? `You and ${frind.name} are even ` :
          frind.balance > 0 ? `${frind.name} owes you ${frind.balance}$` : `You awe ${Math.abs(frind.balance)} to ${frind.name}$`}
      </p>
      <Button click={() => onSelection(frind)}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  )
}

function FormAddFrind({ onAddFriends }) {
  const [name, setName] = useState('')
  const [image, setImage] = useState(require('./images/images-2.jpg'))

  function SubmitHandler(e) {
    e.preventDefault()
    if (!name || !image) return;

    const id = crypto.randomUUID()
    const newFriend = {
      id,
      name,
      image,
      balance: 0,
    }
    onAddFriends(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={SubmitHandler}>
      <label>🧍‍♂️Frind Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label>🌄 Image URL</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
      <Button>ََََAdd</Button>
    </form>

  )
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState('')
  const [paidByUser, setPaidByUser] = useState('')
  const paidByFriend = bill ? bill - paidByUser : ''
  const [whoIsPaying, setWhoIsPaying] = useState('user')

  function billSubmitHandler(e) {
    e.preventDefault()
    if (!paidByUser || !bill) return
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser)
  }

  return (
    <form className="form-split-bill" onSubmit={billSubmitHandler}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>👫 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}


