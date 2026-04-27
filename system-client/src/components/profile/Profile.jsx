import { useState, useRef, useContext, useEffect } from "react";
import authContext from "../../context/authContext";
import studentContext from "../../context/Students/studentContext";
import defaultPfp from "../../../../images/placeholder-user.webp";
import { apiUser } from "../../lib/axios";
import toast from "react-hot-toast";


const Profile = () => {
  return (
    <section className="w-full min-h-screen bg-gray-50 md:bg-transparent">
      <div className="flex flex-col gap-2 p-6 md:p-8 pt-10 md:pt-12">
        <h2 className="text-2xl md:text-3xl font-bold">Profile</h2>
        <p className="text-gray-500 text-sm">View and manage account information</p>
      </div>

      <div className="border-b border-gray-200"></div>

      <div className="flex items-center justify-center w-full py-6 md:py-12 px-4">
        <div className="bg-white p-5 md:p-8 rounded-xl border border-gray-200 w-full max-w-4xl shadow-sm">
          <EditProfile />
        </div>
      </div>
    </section>
  );
};

const EditProfile = () => {
  const { user, authorization, setFname, setLname, setEmail, setPhoneNumber, setCourse, setYear, setStudentType, setSpecialization, setGraduatedAt, setEmploymentType, saveUserProfile } = useContext(authContext);
  const { student } = useContext(studentContext);

  const [ editMode, setEditMode ] = useState(false);
  const [ avatar, setAvatar ] = useState(null);
  const [ formValues, setFormValues ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if(authorization === 1){
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormValues([
        { label: "Full Name", label1: "First Name", label2: "Last Name", type: "two-input", value: (user?.fname + " " + user?.lname) || "", value1: user?.fname, value2: user?.lname},
        { label: "Email", type: "input", value: user?.email || "" },
        { label: "Phone Number", type: "input", value: user?.phoneNumber || "" },
        { label: "Course", type: "dropdown", value: student?.course || "",
          options: [
            "Select Course",
            "BSIT - Information Technology",
            "BSCS - Computer Science",
            "BSBA_MM - major in Marketing Mngt",
            "BSBA_FM - major in Financial Mngt",
            "BSBA_HRDM - major in Human Resource Devt Mngt",
            "BSAIS - Accounting Information System",
            "BSOA - Office Administration",
            "BTVTED_FSM - Food & Service Management",
            "BTVTED_ET - Electrical Technology",  
          ]
        },
        { label: "Year", type: "dropdown", value: student?.year || "",
          options: [
            "Select Year Level", "1st Year", "2nd Year", "3rd Year", "4th Year",
          ]
         },
        { label: "Student Type", type: "dropdown", value: student?.studentType || "",
          options: [
            "Select Student Type", "Regular", "Irregular"
          ]
        },
      ]);
    } else if(authorization === 2){
      setFormValues([
        { label: "Full Name", label1: "First Name", label2: "Last Name", type: "two-input", value: (user?.fname + " " + user?.lname) || "", value1: user?.fname, value2: user?.lname},
        { label: "Email", type: "input", value: user?.email || "" },
        { label: "Phone Number", type: "input", value: user?.phoneNumber || "" },
        { label: "Specialization", type: "dropdown", value: user?.profile.specialization || "",
          options: [
            "Select Specialization",
            "BSIT - Information Technology",
            "BSCS - Computer Science",
            "BSBA_MM - major in Marketing Mngt",
            "BSBA_FM - major in Financial Mngt",
            "BSBA_HRDM - major in Human Resource Devt Mngt",
            "BSAIS - Accounting Information System",
            "BSOA - Office Administration",
            "BTVTED_FSM - Food & Service Management",
            "BTVTED_ET - Electrical Technology",
          ]
        },
        { label: "Graduated at", type: "input", value: user.profile?.graduatedAt || "",
        },
        { label: "Employment", type: "dropdown", value: user?.profile.employmentType,
          options: [
            "Select Employment",
            "Full - Time",
            "Part - Time",
          ]
         },
      ]);
    }

  }, [user, student, authorization]);

  const uploadPfp = async (file) => {
    console.log('hi');

    const formData = new FormData();
    formData.append("pfp", file);

    const res = await apiUser.post("/upload-pfp", formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      } 
    );

    console.log("UPLOAD RESULT:", res.data);

    return res.data.url;
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const previewImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(URL.createObjectURL(file));
  };

  const saveDetails = async () => {
    let toastId;
    if (editMode) {
      let uploadedUrl = null;
      if (fileInputRef.current?.files[0]) {
        setLoading(true);
        toastId = toast.loading("Saving profile...");
        await uploadPfp(fileInputRef.current.files[0]);
      }
      
      await saveUserProfile(); 
    }

    if(toastId)
      toast.dismiss(toastId);

    setLoading(false);
    setEditMode(prev => !prev);
  };

  const editDetails = (label, val, doubleInput) => {
    setFormValues(prev =>
      prev.map(item => {
        if (doubleInput) {
          if (item.label1 === label) {
            return { ...item, value1: val };
          } else if (item.label2 === label) {
            return { ...item, value2: val };
          } 
        }
        return item.label === label ? { ...item, value: val } : item;
      })
    );

    switch (label.toLowerCase()) {
      case "first name":
        setFname(val);
        break;
      case "last name":
        setLname(val);
        break;
      case "email":
        setEmail(val);
        break;
      case "phone number":
        setPhoneNumber(val);
        break;
      case "course":
        if(val.toLowerCase() === "select course") return;
        setCourse(val);
        break;
      case "year":
        if(val.toLowerCase() === "select year level") return;
        setYear(val);
        break;
      case "student type":
        if(val.toLowerCase() === "select student type") return;
        setStudentType(val);
        break;
      case "specialization":
        if(val.toLowerCase() === "select specialization") return;
        setSpecialization(val);
        break;
      case "graduated at":
        setGraduatedAt(val);
        break;
      case "employment":
        if(val.toLowerCase() === "select employment") return;
        setEmploymentType(val);
        break;
      default:
        console.log("Invalid input");
        break;
    }
};

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-200 pb-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
          {/* Avatar */}
          <div
            className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gray-300 cursor-pointer ring-offset-2 ${editMode ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => editMode ? triggerFileUpload() : null}
          >
            <img 
              src={avatar || user?.pfp || defaultPfp} 
              className="w-full h-full object-cover" 
              alt="Profile"
            />

            <div className={`absolute inset-0 flex flex-col justify-center items-center bg-black/50 text-white text-xs font-semibold transition-opacity ${editMode ? "opacity-100" : "opacity-0"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload
            </div>
            {editMode && <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={previewImage}/>}
          </div>

          {/* Profile Info */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold">{user.fname} {user.lname}</h3>
            {authorization === 1 && 
              (<>
                <p className="text-gray-500 text-sm">{user?.profile.course || "No Course Listed"}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {user?.profile.year} - {user?.profile.studentType}
                </p>
              </>)}
          </div>
        </div>

        <button
          onClick={saveDetails}
          className={`w-full md:w-auto px-8 py-2.5 rounded-lg font-semibold text-white transition-all active:scale-95 ${editMode ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"} ${loading ? "cursor-wait" : "cursor-pointer"}`}
          disabled={loading}
        >
          {editMode ? "Save Profile" : loading ? "Saving..." : "Edit Profile"}
        </button>
      </div>

      {/* Profile Details List */}
      <div className="grid grid-cols-1 gap-4">
        {formValues.map((item) => (
          <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border border-gray-100 rounded-xl bg-gray-50/50 gap-3">
            <span className="font-bold text-gray-700 text-sm uppercase tracking-wider">{item.label}</span>

            <div className="w-full sm:w-2/3">
              {editMode ? (
                item.type === "input" ? (
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => editDetails(item.label, e.target.value)}
                    className="w-full border-b-2 border-blue-200 bg-transparent py-1 text-left sm:text-right font-medium focus:border-blue-500 focus:outline-none transition-colors"
                  />
                ) : item.type === "two-input" ? (
                  <div className="grid grid-cols-2 gap-4"> 
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-gray-400 uppercase font-bold" htmlFor={item.label1}>{item.label1}</label>
                      <input
                        id={item.label1}
                        type="text"
                        value={item.value1}
                        onChange={(e) => editDetails(item.label1, e.target.value, true)}
                        className="w-full border-b-2 border-blue-200 bg-transparent py-1 text-left sm:text-right font-medium focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-gray-400 uppercase font-bold" htmlFor={item.label2}>{item.label2}</label>
                      <input
                        id={item.label2}
                        type="text"
                        value={item.value2}
                        onChange={(e) => editDetails(item.label2, e.target.value, true)}
                        className="w-full border-b-2 border-blue-200 bg-transparent py-1 text-left sm:text-right font-medium focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                ) : (
                  <select
                    value={item.value}
                    onChange={(e) => editDetails(item.label, e.target.value)}
                    className="w-full border-b-2 border-blue-200 bg-transparent py-1 text-left sm:text-right font-medium focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    {item.options.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                )
              ) : (
                <p className="text-gray-600 text-left sm:text-right font-medium wrap-break-word">
                  {item.value || "Not Set"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Profile;