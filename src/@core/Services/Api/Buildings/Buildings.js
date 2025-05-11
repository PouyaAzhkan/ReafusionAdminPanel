import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../interceptor/index";
import axios from "axios";

// get all buildings list
export const getAllBuildings = () => {
  return useQuery({
    queryKey: ["Buildings"],
    queryFn: async () => {
      try {
        const response = await api.get("/Building");
        return response; // فرض می‌کنیم داده‌ها در response.data هستند
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
  });
};

// ********************** address ************************

// کش برای ذخیره آدرس‌ها
const addressCache = {};

// صف برای مدیریت درخواست‌ها
const requestQueue = [];
let isProcessingQueue = false;
const MIN_REQUEST_INTERVAL = 1000; // 1 ثانیه تاخیر بین درخواست‌ها

// تابع کمکی برای تاخیر
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// تابع فرمت کردن آدرس
const formatAddress = (data) => {
  if (!data) return "آدرس نامشخص";
  const parts = [
    data.city || "",
    data.locality || "",
    data.principalSubdivision || "",
    data.countryName || "",
  ]
    .filter(Boolean) // حذف موارد خالی
    .join(", ");
  return parts || "آدرس نامشخص";
};

// تابع پردازش صف
const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;

  isProcessingQueue = true;
  const { latitude, longitude, signal, resolve, reject } = requestQueue.shift();

  try {
    const cacheKey = `${latitude},${longitude}`;
    if (addressCache[cacheKey]) {
      resolve(addressCache[cacheKey]);
      isProcessingQueue = false;
      processQueue();
      return;
    }

    // بررسی مختصات معتبر
    if (
      !latitude ||
      !longitude ||
      latitude === "0" ||
      longitude === "0" ||
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      resolve("مختصات نامعتبر");
      isProcessingQueue = false;
      processQueue();
      return;
    }

    const apiKey = "bdc_056320c0b384432c820a84a768784b09"; // کلید API خود را اینجا قرار دهید
    const response = await axios.get(
      `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=fa&key=${apiKey}`,
      { signal }
    );

    const address = formatAddress(response.data);
    addressCache[cacheKey] = address;
    resolve(address);

    // تاخیر قبل از درخواست بعدی
    await delay(MIN_REQUEST_INTERVAL);
    isProcessingQueue = false;
    processQueue();
  } catch (error) {
    if (error.name === "AbortError") {
      reject(error);
    } else {
      console.error(
        "خطا در دریافت آدرس:",
        error.response?.data || error.message
      );
      let errorMessage = "خطا در دریافت آدرس";
      if (error.response?.status === 401) {
        errorMessage = "کلید API نامعتبر است";
      } else if (error.response?.status === 429) {
        errorMessage = "محدودیت تعداد درخواست‌ها";
      }
      reject(errorMessage);
    }
    isProcessingQueue = false;
    processQueue();
  }
};

// تابع اصلی
export const usefetchBuildingsAddress = (latitude, longitude, signal) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ latitude, longitude, signal, resolve, reject });
    processQueue();
  });
};

// ********************** address end *********************

// add building
export const useCreateBuilding = () => {
  return useMutation({
    mutationFn: async (data) => {
      try {
        const response = await api.post("/Building", data);
        return response;
      } catch (error) {
        console.log("error : ", error);
        throw error;
      }
    },
  });
};

// active or deactive building
export const useChangeBuildingStatus = () => {
  return useMutation({
    mutationFn: async ({ id, active }) => {
      try {
        const response = await api.put("/Building/Active", {
          id,
          active,
        });
        return response.data;
      } catch (error) {
        console.error("خطا در تغییر وضعیت:", error);
        throw error;
      }
    },
  });
};

// edit building
export const useEditBuilding = () => {
  return useMutation({
    mutationFn: async ({
      id,
      buildingName,
      workDate,
      floor,
      latitude,
      longitude,
      active,
    }) => {
      try {
        const response = await api.put("/Building", {
          id,
          buildingName,
          workDate,
          floor,
          latitude,
          longitude,
          active,
        });
        return response.data;
      } catch (error) {
        console.error("خطا در تغییر وضعیت:", error);
        throw error;
      }
    },
  });
};
