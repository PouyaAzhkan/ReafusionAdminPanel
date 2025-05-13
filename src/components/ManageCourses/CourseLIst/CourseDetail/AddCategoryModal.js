import { Modal, ModalHeader, ModalBody } from "reactstrap";
import SelectOptions from "../../../../@core/components/select/SelectOptions";
import { useState } from "react";
import AddCourseCategory from "../../../../@core/Services/Api/Courses/CourseDetail/AddCourseCategory";

const AddCategoryModal = ({ addTechModal, setAddTechModal, id, toggle, refetch, CreateCourse }) => {
  const [selectedTech, setSelectedTech] = useState([]);

  const { mutate } = AddCourseCategory(id);

  const handleAddCategory = () => {
    console.log("Selected Tech:", selectedTech);
    const techIds = selectedTech.map((tech) => tech.techId);
    if (techIds.length === 0) {
      alert("لطفاً حداقل یک دسته‌بندی انتخاب کنید.");
      return;
    }

    // تنظیم پیلود به‌صورت آرایه از اشیاء
    const payload = techIds.map((techId) => ({ techId })); // یا { id: techId } یا { technologyId: techId }
    console.log("Payload being sent:", payload);

    mutate(payload, {
      onSuccess: (data) => {
        console.log("Success Response:", data);
        if (data.success && data.message) {
          alert(data.message);
        } else {
          alert("دسته بندی با موفقیت اضافه شد."); 
        }
        toggle();
        refetch();
      },
      onError: (error) => {
        console.error("Error Details:", error.response?.data || error.message);
        alert("خطا در افزودن دسته بندی");
      },
    });
  };

  return (
    <>
      <div className="vertically-centered-modal">
        <Modal
          className="modal-dialog-centered modal-lg"
          isOpen={addTechModal}
          toggle={() => setAddTechModal(!addTechModal)}
        >
          <ModalHeader toggle={() => setAddTechModal(!addTechModal)}>
            لطفا دسته بندی دوره را انتخاب نمایید
          </ModalHeader>
          <ModalBody>
            <div className="d-flex flex-column gap-1 shadow p-3 mb-5 rounded">
              <SelectOptions
                tech={CreateCourse.technologyDtos}
                setSelectedTech={setSelectedTech}
                useTech={handleAddCategory}
              />
            </div>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default AddCategoryModal;