import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, ModalHeader, ModalBody, Spinner } from "reactstrap";
import { useParams } from "react-router-dom";
import AddSocialGroupe from "../@core/Services/Api/Courses/CourseDetail/tabsApi/ManageSocialGroupe/AddSocialGroupe";
import EditSocialGroupe from "../@core/Services/Api/Courses/CourseDetail/tabsApi/ManageSocialGroupe/EditSocialGroupe";
import toast from "react-hot-toast";

const SocialModal = ({ setShowModal, showModal, refetchGroup, groupId, variant, data }) => {
  console.log(data);
  const { id } = useParams();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      groupName: "",
      groupLink: "",
    },
  });

  const textVariant = {
    add: ["ثبت", "افزودن گروه مجازی"],
    edit: ["ویرایش", "ویرایش اطلاعات گروه مجازی"],
  };

  const { mutate: AddSocialGroupes, isPending: addPending } = AddSocialGroupe();
  const { mutate: EditSocialGroupes, isPending: editPending } = EditSocialGroupe();

  // دیباگ برای بررسی props
  console.log("Props data:", data);
  console.log("Variant:", variant);

  useEffect(() => {
    if (variant === "edit" && data) {
      reset({
        groupName: data.groupName || "",
        groupLink: data.groupLink || "",
      });
    } else if (variant === "add") {
      reset({
        groupName: "",
        groupLink: "",
      });
    } else {
      console.error("Invalid variant:", variant);
    }
  }, [data, variant, reset]);

  const handleAddSocialGroupe = (value) => {
    const dataObj = {
      groupName: value.groupName,
      groupLink: value.groupLink,
      courseId: id,
    };
    AddSocialGroupes(dataObj, {
      onSuccess: async () => {
        console.log("گروه مجازی با موفقیت اضافه شد");
        setShowModal(false);
        toast.success("گروه مجازی با موفقیت اضافه شد");
        await refetchGroup();
      },
      onError: (error) => {
        console.error("خطا در افزودن گروه:", error);
        setShowModal(false);
        toast.error("خطا در افزودن گروه");
      },
    });
  };

  const handleEditSocialGroupe = (value) => {
    if (!data || !data.id) {
      console.error("خطا: data یا data.id تعریف نشده است");
      alert("خطا: اطلاعات گروه معتبر نیست");
      return;
    }

    const dataObj = {
      id: data.id, // استفاده از id از props
      groupName: value.groupName,
      groupLink: value.groupLink,
      courseId: id,
    };
    EditSocialGroupes(dataObj, {
      onSuccess: async (response) => {
        console.log("گروه مجازی با موفقیت ویرایش شد", response);
        setShowModal(false);
        toast.success("گروه مجازی با موفقیت ویرایش شد");
        toast.success("در صورت زمان بردن ویرایش لطفا شکیبا باشید")
        await refetchGroup();
      },
      onError: (error) => {
        console.error("خطا در ویرایش گروه:", error);
        setShowModal(false);
        toast.error("خطا در ویرایش گروه");
      },
    });
  };

  return (
    <div className="vertically-centered-modal">
      <Modal
        className="modal-dialog-centered"
        isOpen={showModal}
        toggle={() => setShowModal(false)}
      >
        <ModalHeader toggle={() => setShowModal(false)}>
          {textVariant[variant]?.[1] || "خطا در عنوان"}
        </ModalHeader>
        <ModalBody>
          <form
            className="d-flex flex-column gap-2 p-3 rounded"
            onSubmit={handleSubmit(variant === "edit" ? handleEditSocialGroupe : handleAddSocialGroupe)}
          >
            <input
              name="groupName"
              {...register("groupName", { required: true })}
              placeholder="نام گروه مجازی"
              className="form-control text-primary"
            />
            <input
              name="groupLink"
              {...register("groupLink", { required: true })}
              placeholder="لینک گروه مجازی"
              className="form-control text-primary"
            />
            <button
              className="btn btn-primary mt-2"
              type="submit"
              disabled={addPending || editPending}
            >
              {textVariant[variant]?.[0] || "اقدام"} {addPending || editPending && <Spinner size="sm" color="light" />}
            </button>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default SocialModal;