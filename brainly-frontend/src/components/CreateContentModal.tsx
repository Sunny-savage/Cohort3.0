import { useRef, useState } from "react";
import CrossIcon from "../icons/CrossIcon";
import { Button } from "./Button";
import InputComponent from "./InputComponent";
import axios from "axios";
import { BACKEND_URL } from "../config";

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
}

//controlled component
const CreateContentModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const titleref = useRef<HTMLInputElement>(null);
  const linkref = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentType.Youtube);
  async function addContent() {
    const title = titleref.current?.value;
    const link = linkref.current?.value;

    const res = await axios.post(
      `${BACKEND_URL}/api/v1/content`,
      {
        title: title,
        link: link,
        type: type,
      },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    console.log(res, "this is response");
    titleref.current.value = "";
    linkref.current.value ="";
    onClose();
  }
  return (
    <div>
      {open && (
        <div>
          <div className="w-screen h-screen bg-gray-500 fixed top-0 left-0 opacity-70 flex justify-center"></div>

          <div className="w-screen h-screen fixed top-0 left-0  flex justify-center">
            <div className="flex-col flex justify-center ">
              <span className="bg-white opacity-100 p-4 rounded">
                <div className="flex justify-end">
                  <div onClick={onClose} className="cursor-pointer">
                    {" "}
                    <CrossIcon />
                  </div>
                </div>
                <div>
                  <InputComponent ref={titleref} placeholder={"Title"} />
                  <InputComponent ref={linkref} placeholder={"Link"} />
                </div>
                <div className="ml-2">
                  <h1>Type</h1>
                  <div className="flex justify-center gap-4 pb-2 ">
                    {" "}
                    <Button
                      variant={
                        type === ContentType.Youtube ? "primary" : "secondary"
                      }
                      onClick={() => {
                        setType(ContentType.Youtube);
                      }}
                      text="Youtube"
                    />
                    <Button
                      onClick={() => {
                        setType(ContentType.Twitter);
                      }}
                      variant={
                        type === ContentType.Twitter ? "primary" : "secondary"
                      }
                      text="Twitter"
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={addContent}
                    variant="primary"
                    text="Submit"
                  />
                </div>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateContentModal;
