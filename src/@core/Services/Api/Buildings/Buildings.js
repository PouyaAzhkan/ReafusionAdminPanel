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

// fetch address

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
      isNaN(longitude)
    ) {
      resolve("مختصات نامعتبر");
      isProcessingQueue = false;
      processQueue();
      return;
    }

    const response = await axios.get(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fa`,
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
      reject("خطا در دریافت آدرس");
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
