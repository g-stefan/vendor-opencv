// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("vendor");

messageAction("make");

if (Shell.fileExists("temp/build.done.flag")) {
	return;
};

if (!Shell.directoryExists("source")) {
	exitIf(Shell.system("7z x -aoa archive/" + Project.vendor + ".7z"));
	Shell.rename(Project.vendor, "source");
};

Shell.mkdirRecursivelyIfNotExists("output");
Shell.mkdirRecursivelyIfNotExists("output/bin");
Shell.mkdirRecursivelyIfNotExists("output/include");
Shell.mkdirRecursivelyIfNotExists("output/lib");
Shell.mkdirRecursivelyIfNotExists("temp");

Shell.mkdirRecursivelyIfNotExists("temp/cmake");

if (!Shell.fileExists("temp/build.config.flag")) {
	Shell.setenv("CC", "cl.exe");
	Shell.setenv("CXX", "cl.exe");

	cmdConfig = "cmake";
	cmdConfig += " ../../source";
	cmdConfig += " -G \"Ninja\"";
	cmdConfig += " -DCMAKE_BUILD_TYPE=Release";
	cmdConfig += " -DCMAKE_INSTALL_PREFIX=" + Shell.realPath(Shell.getcwd()) + "\\output";
	cmdConfig += " -DOPENCV_ENABLE_NONFREE=OFF";
	cmdConfig += " -DPYTHON3_EXECUTABLE=C:/Python312/python.exe";

	if (Fabricare.isDynamic()) {
		cmdConfig += " -DBUILD_SHARED_LIBS=ON";
		cmdConfig += " -DWIN32_MT_BUILD=OFF";
	};

	if (Fabricare.isStatic()) {
		cmdConfig += " -DBUILD_SHARED_LIBS=OFF";
		cmdConfig += " -DWIN32_MT_BUILD=ON";
	};

	runInPath("temp/cmake", function () {
		exitIf(Shell.system(cmdConfig));
	});

	Shell.filePutContents("temp/build.config.flag", "done");
};

runInPath("temp/cmake", function () {
	exitIf(Shell.system("ninja"));
	exitIf(Shell.system("ninja install"));
	exitIf(Shell.system("ninja clean"));
});

if (Fabricare.isStatic()) {
	Shell.copyDirRecursively("output/x64/vc17/staticlib", "output/lib");
};
Shell.copyFile("output/lib/opencv_calib3d4100.lib", "output/lib/opencv_calib3d.lib");
Shell.copyFile("output/lib/opencv_core4100.lib", "output/lib/opencv_core.lib");
Shell.copyFile("output/lib/opencv_dnn4100.lib", "output/lib/opencv_dnn.lib");
Shell.copyFile("output/lib/opencv_features2d4100.lib", "output/lib/opencv_features2d.lib");
Shell.copyFile("output/lib/opencv_flann4100.lib", "output/lib/opencv_flann.lib");
Shell.copyFile("output/lib/opencv_gapi4100.lib", "output/lib/opencv_gapi.lib");
Shell.copyFile("output/lib/opencv_highgui4100.lib", "output/lib/opencv_highgui.lib");
Shell.copyFile("output/lib/opencv_imgcodecs4100.lib", "output/lib/opencv_imgcodecs.lib");
Shell.copyFile("output/lib/opencv_imgproc4100.lib", "output/lib/opencv_imgproc.lib");
Shell.copyFile("output/lib/opencv_ml4100.lib", "output/lib/opencv_ml.lib");
Shell.copyFile("output/lib/opencv_objdetect4100.lib", "output/lib/opencv_objdetect.lib");
Shell.copyFile("output/lib/opencv_photo4100.lib", "output/lib/opencv_photo.lib");
Shell.copyFile("output/lib/opencv_stitching4100.lib", "output/lib/opencv_stitching.lib");
Shell.copyFile("output/lib/opencv_video4100.lib", "output/lib/opencv_video.lib");
Shell.copyFile("output/lib/opencv_videoio4100.lib", "output/lib/opencv_videoio.lib");

Shell.filePutContents("temp/build.done.flag", "done");

