import { Modal, ModalHeader, ModalBody, Spinner } from "reactstrap";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import AddGroupe from "../@core/Services/Api/Courses/CourseDetail/tabsApi/ManageGroupe/AddGroupe";
import EditGroupe from "../@core/Services/Api/Courses/CourseDetail/tabsApi/ManageGroupe/EditGroupe";
import toast from "react-hot-toast";

const ModalGroup = ({
  setShowModal,
  showModal,
  refetchGroup,
  groupId,
  variant,
  groupData,
}) => {
  const { id } = useParams();
  const { mutate: AddGroupes, isPending: addPending } = AddGroupe();
  const { mutate: EditGroupes, isPending: editPending } = EditGroupe(); 

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      GroupName: "",
      GroupCapacity: "",
    },
  });

  useEffect(() => {
    if (variant === "edit" && groupData) {
      reset({
        GroupName: groupData.groupName || "",
        GroupCapacity: groupData.groupCapacity || "",
      });
    } else if (variant === "add") {
      reset({
        GroupName: "",
        GroupCapacity: "",
      });
    }
  }, [groupData, variant, reset]);

  const handleAddGroupe = (value) => {
    const formData = new FormData();
    formData.append("GroupName", value.GroupName);
    formData.append("CourseId", id);
    formData.append("GroupCapacity", value.GroupCapacity.toString());

    if (variant === "edit" && groupId) {
      formData.append("GroupId", groupId);
    }

    AddGroupes(formData, {
      onSuccess: async (data) => {
        const newGroupAdded = data?.courseGroupDtos?.some(
          (group) => group.groupName === value.GroupName
        );

        if (data && data.courseGroupDtos && newGroupAdded) {
          toast.success("گروه با موفقیت اضافه شد");

          // 🟡 صبر کن تا refetchGroup تموم بشه
          await refetchGroup();

          setShowModal(false);
        } else {
          toast.success("گروه با موفقیت اضافه شد");
          toast.success("در صورت طول کشیدن اضافه شدن گروه شکیبا باشید");
          console.log("Group not found in response:", data);

          await refetchGroup(); // حتی در صورت else هم refetch کن
          setShowModal(false);
        }
      },
      onError: (error) => {
        console.error("Error submitting form:", error);
        toast.error("خطا در ثبت گروه: " + (error.message || "مشکل ناشناخته"));
      },
    });
  };

  const handleEditGroupe = (value) => {
    const formData = new FormData();
    formData.append("Id", groupId);
    formData.append("GroupName", value.GroupName);
    formData.append("CourseId", id);
    formData.append("GroupCapacity", value.GroupCapacity.toString());

    if (variant === "edit" && groupId) {
      formData.append("GroupId", groupId);
    }

    EditGroupes(formData, {
      onSuccess: async (data) => {
        const newGroupAdded = data?.courseGroupDtos?.some(
          (group) => group.groupName === value.GroupName
        );

        if (data && data.courseGroupDtos && newGroupAdded) {
          toast.success("گروه با موفقیت ویرایش شد");

          // 🟡 صبر کن تا refetchGroup تموم بشه
          await refetchGroup();

          setShowModal(false);
        } else {
          toast.success("گروه با موفقیت ویرایش شد");
          toast.success("در صورت طول کشیدن ویرایش گروه لطفا شکیبا باشید");
          console.log("Group not found in response:", data);

          await refetchGroup(); 
          setShowModal(false);
        }
      },
      onError: (error) => {
        console.error("Error submitting form:", error);
        const errorMessage = error?.response?.data?.ErrorMessage?.[0] || "خطا در حذف کامنت";
        toast.error(errorMessage); 
      },
    });
  };

  const showModalStatus = variant === "edit" || variant === "add";
  const textVariant = {
    add: ["ثبت", "افزودن گروه"],
    edit: ["ویرایش", "ویرایش اطلاعات گروه"],
  };

  return (
    <div className="vertically-centered-modal">
      <Modal
        className="modal-dialog-centered"
        isOpen={showModalStatus && showModal}
        toggle={() => setShowModal(!showModal)}
      >
        <ModalHeader toggle={() => setShowModal(!showModal)}>
          {textVariant?.[variant]?.[1]}
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={handleSubmit(variant === "edit" ? handleEditGroupe : handleAddGroupe)}
            className="d-flex flex-column gap-1 shadow p-3 mb-5 bg-body rounded"
          >
            <input
              {...register("GroupName", { required: "نام گروه اجباری است" })}
              placeholder="نام گروه"
              className="form-control text-primary"
            />
            {errors.GroupName && (
              <span className="text-danger">{errors.GroupName.message}</span>
            )}

            <input
              {...register("GroupCapacity", {
                required: "ظرفیت گروه اجباری است",
                valueAsNumber: true,
              })}
              placeholder="ظرفیت گروه"
              className="form-control text-primary"
              type="number"
            />
            {errors.GroupCapacity && (
              <span className="text-danger">{errors.GroupCapacity.message}</span>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={addPending || editPending}
            >
              {textVariant?.[variant]?.[0]} {addPending || editPending && <Spinner size="sm" color="light" />}
            </button>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ModalGroup;
