import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import { TransitionGroup } from 'react-transition-group';
import IncrementDecrementBtn from './increment_decrement.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector, useDispatch } from "react-redux";
import { saveOrderItems } from "./redux/reducer";

import "./App.css";





interface RenderItemOptions {
  item: {};
  handleRemoveFruit: (item: {}) => void;
}

function renderItem({ item, handleRemoveFruit }: RenderItemOptions) {
  return (

    <ListItem
      style={{border: "2px solid purple",padding:"5px",margin:"8px",borderRadius:"5px",width:"80%",marginLeft:"10%"}}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          title="Delete"
          onClick={() => handleRemoveFruit(item)}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <div style = {{width:"92%",display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
        <p style={{fontSize:"15px",marginLeft:"20px"}}>{item["name_of_item_order"]}</p>
        <IncrementDecrementBtn val={item["number_value"]}/>
      </div>
      
    </ListItem>
  );
}

export default function TransitionGroupExample({holder,updt}) {
  const dispatch = useDispatch();
  const [fruitsInBasket, setFruitsInBasket] = React.useState([]);
  React.useEffect(() => {
    console.log("holder changed")
    console.log(holder)
    handleAddFruit(holder)}
  ,[holder]);
  const handleAddFruit = (holder: []) => {

      setFruitsInBasket([...holder])
      console.log("/////////////")
      console.log(typeof(holder))
    

  };

  const handleRemoveFruit = (item: {}) => {
    var tmp = holder.filter(
      (dict) => dict.name_of_item_order !== item["name_of_item_order"]
    );
    updt(Array.from(tmp))
    dispatch(saveOrderItems(Array.from(tmp)))
    setFruitsInBasket((prev) => [...prev.filter((i) => i["name_of_item_order"] !== item["name_of_item_order"])]);
  };

  
  

  return (
    <div>
      <Box sx={{ mt: 1 }}>
        <List>
          <TransitionGroup >
            {fruitsInBasket.map((item) => (
              
              <Collapse key={item["name_of_item_order"]}>
                {renderItem({ item, handleRemoveFruit })}
              </Collapse>
             
            ))}
          </TransitionGroup>
        </List>
      </Box>
    </div>
  );
}
