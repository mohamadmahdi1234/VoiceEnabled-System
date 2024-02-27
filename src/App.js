import { useRef, useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import "./App.css";
import { socket } from "./socket";
import TransitionGroupExample from "./Demo.tsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { saveOrderItems } from "./redux/reducer";
function App() {
  const dispatch = useDispatch();
  const [isToastVisible, setIsToastVisible] = useState(false);

  const [isToastVisibleEdit, setIsToastVisibleEdit] = useState(false);
  const [whichdeleted, setwhichdeleted] = useState("");
  const { transcript, interimTranscript, finalTranscript, resetTranscript } =
    useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState("");
  console.log("print from reducer");
  console.log(useSelector((state) => state.slice_for_torob.order_items));
  const [order_items, setOrderItems] = useState(
    useSelector((state) => state.slice_for_torob.order_items)
  );
  const microphoneRef = useRef(null);
  const up2orderitem = (holders) => setOrderItems(holders);

  useEffect(() => {
    socket.on("order_items", function (result) {
      const merged_map = new Map();
      [...order_items, ...result].forEach((dict) => {
        if (!merged_map.has(dict.name)) {
          merged_map.set(dict["name_of_item_order"], dict);
        }
      });
      setOrderItems(Array.from(merged_map.values()));
      dispatch(saveOrderItems(Array.from(merged_map.values())));
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off("order_items");
    };
  }, [order_items]);

  useEffect(() => {
    socket.on("Edit_items", function (result) {
      console.log("result of server is in edit : ");
      console.log(result);
      console.log("/////////////////////////");
      if (result.length >= 2) {
        const hold_all_foods = order_items.map(
          (mapItem) => mapItem.name_of_item_order
        );
        var existance_of_first = hold_all_foods.includes(
          result[0]["name_of_item_order"]
        );
        var existance_of_second = hold_all_foods.includes(
          result[1]["name_of_item_order"]
        );
        console.log(existance_of_first);
        console.log(result[0]["name_of_item_order"]);
        console.log(order_items);
        console.log(existance_of_second);

        if (existance_of_first && existance_of_second) {
          console.log("---------------------------**************************");
          var tmp = order_items.filter(
            (dict) => dict.name_of_item_order !== result[0].name_of_item_order
          );

          console.log(tmp);
          console.log("++++++++++++++++++++++++++++**************************");
          setOrderItems(tmp);
          dispatch(saveOrderItems(Array.from(tmp)));
          setIsToastVisibleEdit(true);
        } else if (existance_of_first) {
          var tmp = order_items.filter(
            (dict) => dict.name_of_item_order !== result[0].name_of_item_order
          );
          console.log("uytr");
          console.log(tmp);
          tmp.push(result[1]);
          setOrderItems(tmp);
          dispatch(saveOrderItems(Array.from(tmp)));
          setIsToastVisibleEdit(true);
        } else if (existance_of_second) {
          var tmp = order_items.filter(
            (dict) => dict.name_of_item_order !== result[1].name_of_item_order
          );
          console.log("poiu");
          tmp.push(result[0]);
          setOrderItems(tmp);
          dispatch(saveOrderItems(Array.from(tmp)));
          setIsToastVisibleEdit(true);
        }
      }
    });

    return () => {
      socket.off("Edit_items");
    };
  }, [order_items]);

  socket.on("delete_items", function (result) {
    console.log("result of server is in delete : ");
    console.log(result);
    console.log("/////////////////////////");
    const merged_map = new Map();
    const listOfNames = result.map((mapItem) => mapItem.name_of_item_order);
    order_items.forEach((dict) => {
      if (listOfNames.includes(dict.name_of_item_order)) {
        setIsToastVisible(true);
        setwhichdeleted(dict.name_of_item_order);
      } else {
        merged_map.set(dict["name_of_item_order"], dict);
      }
    });
    setOrderItems(Array.from(merged_map.values()));
  });

  useEffect(() => {
    if (isToastVisible) {
      toast(`food item :${whichdeleted} deleted !!!`, {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsToastVisible(false);
      setwhichdeleted("");
    }
    if (isToastVisibleEdit) {
      toast(`Edit succesfully!!!`, {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsToastVisibleEdit(false);
    }
  }, [order_items]);

  useEffect(() => {
    if (finalTranscript !== "") {
      console.log("Got final result:", finalTranscript);

      setResult(finalTranscript);
    }
  }, [interimTranscript, finalTranscript]);
  useEffect(() => {
    console.log("change");
    console.log(result);
    console.log("///////");
    if (result == "") {
      return;
    }
    socket.emit("result_1", result);
    resetTranscript();
  }, [result]);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }
  const handleListing = () => {
    setIsListening(true);
    //microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
      language: "fa",
    });
  };
  const stopHandle = () => {
    setIsListening(false);
    //microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
  };
  const handleReset = () => {
    //stopHandle();
    setResult("");
    resetTranscript();
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          columnGap: "40px",
          width: "100%",
          height: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
            width: "60%",
          }}
        >
          <div
            className="microphone-wrapper"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              columnGap: "5%",
              marginTop: "60px",
            }}
          >
            <div className="container">
              <button
                id="speech"
                className="btn m-left type2"
                onClick={!isListening ? handleListing : stopHandle}
              >
                <i class="fa fa-microphone" aria-hidden="true"></i>
              </button>

              {isListening ? <div className="pulse-ring"></div> : null}
            </div>
            <ReactMic
              record={isListening}
              className="voice_holder"
              strokeColor="#c9ced0"
              backgroundColor="#6a92d3"
            />
          </div>
          <div
            style={{
              borderWidth: "100px",
              width: "50%",
              padding: "30px",
              margin: "10px",
              border: "1px solid blue",
              borderRadius: "5px",
              wordWrap: "break-word",
              textAlign: "right",
              scrollBehavior: "auto",
            }}
          >
            {transcript}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "fit-content",
            borderLeft: "1px solid blue",
            marginTop: "40px",
            marginRight: "40px",
            padding: "20px",
            top: "20px",
          }}
        >
          {order_items ? (
            <TransitionGroupExample holder={order_items} updt={up2orderitem} />
          ) : (
            <div style={{ width: "100%" }}></div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
export default App;
