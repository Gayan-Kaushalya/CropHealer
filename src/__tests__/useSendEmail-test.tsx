import { renderHook } from "@testing-library/react-hooks"; // Import for testing hooks
import useSendEmail from "../components/useSendEmail"; // Adjust the import based on the file location
import Mailer from "react-native-mail";

// Mock the react-native-mail library
jest.mock("react-native-mail", () => ({
  mail: jest.fn((options, callback) => {
    // Call the callback with no error and a dummy event
    callback(null, { event: "sent" });
  }),
}));

describe("useSendEmail", () => {
  it("sends an email with the correct parameters", async () => {
    const prediction = "Leaf Blight";
    const reality = "Healthy Leaf";

    // Render the hook
    const { result } = renderHook(() => useSendEmail({ prediction, reality }));

    // Call the sendEmail function
    await result.current({
      body: "This is a test email.",
      isHTML: true,
    });

    // Check if Mailer.mail was called with the correct parameters
    expect(Mailer.mail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Wrong Plant Disease Prediction",
        recipients: ["gaykaush@gmail.com"],
        body: `The model predicted ${prediction} but the actual disease is ${reality}`,
        isHTML: true,
      }),
      expect.any(Function) // We can use expect.any to match the callback function
    );
  });

  it("rejects the promise when an error occurs", async () => {
    const prediction = "Leaf Blight";
    const reality = "Healthy Leaf";

    // Mock Mailer's mail function to call the error callback
    Mailer.mail.mockImplementationOnce((options, callback) => {
      callback(new Error("Mail error"), null);
    });

    const { result } = renderHook(() => useSendEmail({ prediction, reality }));

    await expect(
      result.current({
        body: "This is a test email.",
        isHTML: true,
      })
    ).rejects.toThrow("Mail error");
  });
});
