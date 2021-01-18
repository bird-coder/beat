package com.jltech.beat;

public class Data {
    private static boolean backKeyDisabled = false;

    public static void setBackKeyDisabled(boolean backKeyDisabled) {
        Data.backKeyDisabled = backKeyDisabled;
    }

    public static boolean isBackKeyDisabled() {
        return backKeyDisabled;
    }
}
