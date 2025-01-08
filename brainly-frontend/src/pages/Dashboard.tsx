import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import CreateContentModal from "../components/CreateContentModal";
import PlusIcon from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import SideBar from "../components/SideBar";
import useContent from "../hooks/useContent";
import { BACKEND_URL } from "../config";
import axios from "axios";

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const { content, fetchContent } = useContent();

  async function share() {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/brain/share`,
      { share: true },
      { headers: { token: localStorage.getItem("token") } }
    );
    console.log(res);
    const sharelink = `http://localhost:5173/${res.data.link}`
    console.log(sharelink);
    navigator.clipboard.writeText(sharelink);
    
    
  }

  useEffect(() => {
    fetchContent;
  }, [modalOpen]);
  return (
    <>
      <div>
        <SideBar />

        <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">
          <CreateContentModal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
            }}
          />
          <div className="flex justify-end gap-4 mb-2 ">
            {" "}
            <Button
              onClick={() => {
                setModalOpen(true);
              }}
              variant="primary"
              text="Add content"
              startIcon={<PlusIcon />}
            />
            <Button
              variant="secondary"
              text="Share brain"
              startIcon={<ShareIcon />}
              onClick={share}
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            {content.map((card) => (
              <Card type={card.type} title={card.title} link={card.link} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
