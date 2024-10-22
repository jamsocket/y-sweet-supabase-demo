"use client";

interface CopyLinkProps {
  docId: string;
  setToolTipMessage: (message: string) => void;
}
export default function CopyLink(props: CopyLinkProps) {
  const { docId, setToolTipMessage } = props;
  const copyToClipboard = async () => {
    const textToCopy = `${window.location.origin}/document/${docId}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setToolTipMessage("Link Copied!"); // Show the "Link copied" pop-up

      // Hide the pop-up after 2 seconds
      setTimeout(() => setToolTipMessage(""), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      className="flex items-center bg-gray-100 border border-blue-300 text-blue-600 px-4 py-2 rounded-full hover:bg-gray-200"
      onClick={() => {
        copyToClipboard();
      }}
    >
      Copy Link
    </button>
  );
}
