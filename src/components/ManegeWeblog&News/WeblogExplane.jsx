import React from "react";
import { ArrowLeft, Link } from "react-feather";

const WeblogExplane = ({ Api1 }) => {
  return (
    <div className="container">
      {/* بلوک نقل‌قول بالا */}
      <div className="d-flex justify-content-between align-items-start border border-primary bg-light rounded p-4 mx-auto" >
        <p title={"ییییییییییییی"}  className="text-secondary text-justify mb-0 pe-3" style={{ width: "90%" }}> {Api1?.googleDescribe} </p>
        <Link color="#CECCFD" size={60} />
      </div>
      {/* عنوان و متن آموزشی */}
      <div className="pt-1 text-dark">
        <h2 className="h3 fw-semibold pt-3 text-primary"> در این خبر چه چیز هایی به دانش شما افزوده میشود؟ </h2>
        <p className="text-justify pt-1">
        در سال 2025، دنیای برنامه‌نویسی با تغییرات بزرگی مواجه شده است. از هوش مصنوعی گرفته تا ابزارهای جدید کدنویسی، برنامه‌نویسان با فرصت‌ها و چالش‌های جدیدی روبه‌رو هستند
        </p>
        {/* لیست آموزشی با آیکون‌های فلش در دایره زرد */}
        <ul className="list-unstyled pt-1">
          {[
            "کار با ابزارهای AI-driven مثل پلتفرم vibe-coding که اپل و Anthropic توسعه داده‌اند",
            "یادگیری میانبرهای کدنویسی با ابزارهای هوش مصنوعی مانند Claude Sonnet",
            "ساخت اپلیکیشن‌های مقیاس‌پذیر با زبان‌های محبوب مثل Python که در گزارش GitHub 2024 رتبه اول را کسب کرد",
            "نحوه استفاده از WebAssembly برای محاسبات علمی بدون نیاز به نصب"
          ].map((item, index) => (
            <li className="d-flex align-items-center fw-semibold mb-1 cursor-pointer"  key={index}>
              <div
                className="rounded-circle d-flex justify-content-center align-items-center me-1"
                style={{
                  backgroundColor: "#FFC224",
                  width: "35px",
                  height: "35px"
                }}
              >
                <ArrowLeft size={18} color="#000" />
              </div>
              {item}
            </li>
          ))}
        </ul>
        <p className="pt-1">
          بدون شک، برنامه نویسی یکی از مهم‌ترین مهارت‌هایی است که امروزه نه تنها
          برای فارغ التحصیلان و دانشجویان رشته مهندسی کامپیوتر.
        </p>
      </div>
    </div>
  );
};

export default WeblogExplane;
